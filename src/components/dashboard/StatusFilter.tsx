import Link from "next/link";

const FILTERS = ["All", "Pending", "Done", "Completed", "Resolved"] as const;

export type StatusFilterValue = (typeof FILTERS)[number];

interface StatusFilterProps {
  current: StatusFilterValue;
}

export default function StatusFilter({ current }: StatusFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter by status"
    >
      {FILTERS.map((status) => {
        const isActive = current === status;
        const href =
          status === "All"
            ? "/dashboard/queries"
            : `/dashboard/queries?status=${status}`;

        return (
          <Link
            key={status}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-transparent bg-gradient-accent text-white shadow-glow"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {status}
          </Link>
        );
      })}
    </div>
  );
}

export function parseStatusFilter(value?: string): StatusFilterValue {
  if (value && FILTERS.includes(value as StatusFilterValue)) {
    return value as StatusFilterValue;
  }
  return "All";
}
