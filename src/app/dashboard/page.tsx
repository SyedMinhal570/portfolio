import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Inbox, MessageSquare } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import prisma from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function DashboardPage() {
  const [totalContacts, pendingQueries, resolvedQueries, recentContacts] =
    await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: "Pending" } }),
      prisma.contact.count({
        where: { status: { in: ["Done", "Completed", "Resolved"] } },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const stats = [
    {
      label: "Total Contacts",
      value: totalContacts,
      icon: Inbox,
      accent: "from-accent-purple/20 to-accent-purple/5 text-accent-purple",
    },
    {
      label: "Pending Queries",
      value: pendingQueries,
      icon: Clock,
      accent: "from-amber-400/20 to-amber-400/5 text-amber-400",
    },
    {
      label: "Resolved",
      value: resolvedQueries,
      icon: CheckCircle2,
      accent: "from-accent-cyan/20 to-accent-cyan/5 text-accent-cyan",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-4 text-zinc-400">
          Overview of contact form submissions and query status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <article
            key={label}
            className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">{label}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-white">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-white/10 bg-surface shadow-glow">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-accent-purple" aria-hidden="true" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Recent Contacts
            </h2>
          </div>
          <Link
            href="/dashboard/queries"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan transition-colors hover:text-white"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            No contact submissions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-200">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{contact.email}</td>
                    <td className="max-w-[200px] truncate px-6 py-4 text-zinc-400">
                      {contact.subject ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">
                      {formatDate(contact.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
