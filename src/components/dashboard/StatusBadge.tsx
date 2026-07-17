const STATUS_STYLES: Record<string, string> = {
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  Done: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
  Completed: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
  Resolved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ?? "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}
