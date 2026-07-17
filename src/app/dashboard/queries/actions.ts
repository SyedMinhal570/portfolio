"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["Pending", "Done", "Completed", "Resolved"] as const;

export async function updateContactStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await prisma.contact.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/queries");
  revalidatePath("/dashboard");
}
