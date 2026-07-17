"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { validateEmail } from "@/lib/validation";
import { loginAction } from "./actions";

const SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
const RECAPTCHA_SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;

function getRecaptchaToken(): Promise<string | null> {
  const timeoutMs = 8000;

  const tokenPromise = new Promise<string | null>((resolve) => {
    if (!SITE_KEY) {
      console.log("[recaptcha] SITE_KEY not configured");
      resolve(null);
      return;
    }

    if (!window.grecaptcha) {
      console.log("[recaptcha] grecaptcha not available");
      resolve(null);
      return;
    }

    window.grecaptcha.ready(() => {
      console.log("[recaptcha] grecaptcha.ready() fired");
      console.log("[recaptcha] executing with SITE_KEY=", SITE_KEY);
      console.log("[recaptcha] script src should be=", RECAPTCHA_SCRIPT_SRC);

      window.grecaptcha!
        .execute(SITE_KEY, { action: "login" })
        .then((token: string) => {
          console.log(
            "[recaptcha] token generated successfully, length=",
            token.length
          );
          resolve(token);
        })
        .catch((err: unknown) => {
          console.error("[recaptcha] execute failed:", err);
          resolve(null);
        });
    });
  });

  const timeoutPromise = new Promise<string | null>((resolve) => {
    setTimeout(() => {
      console.log("[recaptcha] timed out after 8s");
      resolve(null);
    }, timeoutMs);
  });

  return Promise.race([tokenPromise, timeoutPromise]);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="google.com/recaptcha/api.js"]'
    );
    console.log(
      "[recaptcha] DOM script src on mount=",
      script?.src ?? "(no recaptcha script in DOM yet)"
    );
    console.log("[recaptcha] expected script src=", RECAPTCHA_SCRIPT_SRC);
  }, []);

  function validateForm(): boolean {
    const nextErrors: { email?: string; password?: string } = {};

    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log(
        "[login] submit: SITE_KEY length=",
        SITE_KEY.length,
        "will render Script=",
        !!SITE_KEY
      );

      const recaptchaToken = await getRecaptchaToken();
      if (!recaptchaToken) {
        console.log(
          "[login] submit: aborting before loginAction — no recaptcha token (SITE_KEY or grecaptcha missing)"
        );
        setSubmitError("Verification failed. Please try again.");
        return;
      }

      console.log("[login] submit: calling loginAction Server Action");
      const result = await loginAction(email.trim(), password, recaptchaToken);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20 sm:px-6">
      {SITE_KEY && (
        <Script
          id="google-recaptcha-v3"
          src={RECAPTCHA_SCRIPT_SRC}
          strategy="afterInteractive"
          onLoad={() => {
            console.log("[recaptcha] script onLoad, src=", RECAPTCHA_SCRIPT_SRC);
          }}
          onError={() => {
            console.error("[recaptcha] script onError, src=", RECAPTCHA_SCRIPT_SRC);
          }}
        />
      )}

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
            <Lock size={22} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to access the dashboard</p>
        </motion.div>

        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {submitError}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow sm:p-8"
        >
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
              Email <span className="text-accent-purple">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
              Password <span className="text-accent-purple">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-hover hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
