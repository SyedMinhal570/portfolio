import { MessageSquare } from "lucide-react";
import ContactStatusSelect from "@/components/dashboard/ContactStatusSelect";
import MessagePreview from "@/components/dashboard/MessagePreview";
import StatusFilter, {
  parseStatusFilter,
} from "@/components/dashboard/StatusFilter";
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

export default async function ContactQueriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const filter = parseStatusFilter(searchParams.status);

  const contacts = await prisma.contact.findMany({
    where:
      filter === "All"
        ? undefined
        : {
            status: filter,
          },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
          Contact Queries
        </h1>
        <p className="mt-4 text-zinc-400">
          Manage and update the status of all contact form submissions.
        </p>
      </div>

      <div className="mb-6">
        <StatusFilter current={filter} />
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface px-6 py-16 text-center shadow-glow">
          <MessageSquare
            size={32}
            className="mx-auto mb-3 text-zinc-600"
            aria-hidden="true"
          />
          <p className="text-sm text-zinc-500">
            {filter === "All"
              ? "No contact queries yet."
              : `No queries with status "${filter}".`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-surface shadow-glow md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Subject</th>
                    <th className="px-6 py-3 font-medium">Message</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-200">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{contact.email}</td>
                      <td className="max-w-[160px] truncate px-6 py-4 text-zinc-400">
                        {contact.subject ?? "—"}
                      </td>
                      <td className="max-w-[240px] px-6 py-4">
                        <MessagePreview message={contact.message} />
                      </td>
                      <td className="px-6 py-4">
                        <ContactStatusSelect
                          contactId={contact.id}
                          currentStatus={contact.status}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-zinc-500">
                        {formatDate(contact.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="rounded-xl border border-white/10 bg-surface p-4 shadow-glow"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200">{contact.name}</p>
                    <p className="truncate text-sm text-zinc-400">
                      {contact.email}
                    </p>
                  </div>
                  <ContactStatusSelect
                    contactId={contact.id}
                    currentStatus={contact.status}
                  />
                </div>

                {contact.subject && (
                  <p className="mb-2 text-sm">
                    <span className="text-zinc-500">Subject: </span>
                    <span className="text-zinc-300">{contact.subject}</span>
                  </p>
                )}

                <div className="mb-3 text-sm">
                  <MessagePreview message={contact.message} />
                </div>

                <p className="text-xs text-zinc-500">
                  {formatDate(contact.createdAt)}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
