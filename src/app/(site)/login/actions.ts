"use server";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type LoginResult = { success: true } | { success: false; error: string };

/** Flip to true once Google reCAPTCHA v3 keys work reliably again. */
const RECAPTCHA_ENABLED = false;

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;
const RECAPTCHA_MIN_SCORE = 0.5;

function getClientIp(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headerStore.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "127.0.0.1";
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  console.log("[loginAction] verifyRecaptcha: secretPresent=", !!secret, "tokenLength=", token?.length ?? 0);
  if (!secret || !token) return false;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    console.log("[loginAction] verifyRecaptcha result:", {
      success: data.success,
      score: data.score,
      action: data.action,
      errorCodes: data["error-codes"],
    });

    if (!data.success) return false;
    if (typeof data.score === "number" && data.score < RECAPTCHA_MIN_SCORE) {
      return false;
    }
    if (data.action && data.action !== "login") return false;

    return true;
  } catch (err) {
    console.log("[loginAction] verifyRecaptcha threw:", err);
    return false;
  }
}

async function recordFailedAttempt(ipAddress: string) {
  const existing = await prisma.loginAttempt.findUnique({
    where: { ipAddress },
  });

  const now = new Date();
  // After a block window expires, start a fresh attempt counter
  // instead of immediately re-blocking on the next failure.
  const blockExpired =
    !!existing?.blockedUntil && existing.blockedUntil <= now;
  const previousAttempts = blockExpired ? 0 : (existing?.attempts ?? 0);
  const nextAttempts = previousAttempts + 1;
  const blockedUntil =
    nextAttempts >= MAX_ATTEMPTS
      ? new Date(now.getTime() + BLOCK_DURATION_MS)
      : existing?.blockedUntil && existing.blockedUntil > now
        ? existing.blockedUntil
        : null;

  console.log("[loginAction] recordFailedAttempt:", {
    ipAddress,
    previousAttempts,
    nextAttempts,
    blockedUntil,
  });

  await prisma.loginAttempt.upsert({
    where: { ipAddress },
    create: {
      ipAddress,
      attempts: nextAttempts,
      lastAttemptAt: now,
      blockedUntil,
    },
    update: {
      attempts: nextAttempts,
      lastAttemptAt: now,
      blockedUntil,
    },
  });

  console.log("[loginAction] recordFailedAttempt upsert complete for", ipAddress);
}

export async function loginAction(
  email: string,
  password: string,
  recaptchaToken: string
): Promise<LoginResult> {
  console.log("[loginAction] called with email=", email.trim(), "tokenPresent=", !!recaptchaToken);

  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);
  const now = new Date();
  console.log("[loginAction] IP extracted:", ipAddress);

  const attempt = await prisma.loginAttempt.findUnique({
    where: { ipAddress },
  });
  console.log("[loginAction] existing LoginAttempt:", attempt);

  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    console.log("[loginAction] blocked until", attempt.blockedUntil);
    return {
      success: false,
      error: "Too many login attempts. Please try again in a few minutes.",
    };
  }

  if (RECAPTCHA_ENABLED) {
    const captchaOk = await verifyRecaptcha(recaptchaToken);
    console.log("[loginAction] recaptcha verify result:", captchaOk);
    if (!captchaOk) {
      return {
        success: false,
        error: "Verification failed. Please try again.",
      };
    }
  } else {
    console.log("[loginAction] RECAPTCHA_ENABLED=false — skipping siteverify");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  console.log("[loginAction] supabase sign-in error:", error?.message ?? null);

  if (error) {
    await recordFailedAttempt(ipAddress);
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  console.log("[loginAction] success — clearing LoginAttempt for", ipAddress);
  await prisma.loginAttempt.deleteMany({ where: { ipAddress } });

  return { success: true };
}
