"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateContactStatus } from "@/app/dashboard/queries/actions";

const STATUSES = ["Pending", "Done", "Completed", "Resolved"] as const;

interface ContactStatusSelectProps {
  contactId: string;
  currentStatus: string;
}

export default function ContactStatusSelect({
  contactId,
  currentStatus,
}: ContactStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = e.target.value;
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      await updateContactStatus(contactId, nextStatus);
    });
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Update contact status"
        aria-busy={isPending}
        className="cursor-pointer rounded-lg border border-white/10 bg-background px-2.5 py-1.5 pr-8 text-xs font-medium text-zinc-200 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20 disabled:cursor-wait disabled:opacity-60"
      >
        {STATUSES.map((status) => (
          <option key={status} value={status} className="bg-surface">
            {status}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2
          size={14}
          className="absolute -right-5 animate-spin text-accent-cyan"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
