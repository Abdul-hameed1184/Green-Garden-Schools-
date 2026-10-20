"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileClock,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  MessageSquare,
  Phone,
  PlusCircle,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { InboxStatusPill } from "@/components/admin/inbox-status-pill";
import { useAlbums } from "@/hooks/use-albums";
import { useAdmissionsInquiries, useContactMessages } from "@/hooks/use-inquiries";
import { useSession } from "@/hooks/use-auth";

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function OverviewPage() {
  const { data: session } = useSession();
  const { data: albums = [] } = useAlbums("All");
  const { data: inquiries = [] } = useAdmissionsInquiries();
  const { data: messages = [] } = useContactMessages();

  const published = albums.filter((i) => i.status === "Published").length;
  const drafts = albums.filter((i) => i.status === "Review").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const newMessages = messages.filter((m) => m.status === "new").length;

  const recent = [
    ...inquiries.map((i) => ({
      id: i.id,
      kind: "Inquiry" as const,
      name: `${i.firstName} ${i.lastName}`,
      detail: i.gradeLevel || i.email,
      status: i.status,
      createdAt: i.createdAt,
    })),
    ...messages.map((m) => ({
      id: m.id,
      kind: "Message" as const,
      name: m.fullName,
      detail: m.subject || m.message,
      status: m.status,
      createdAt: m.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const actions = [
    { href: "/admin/album?new=1", label: "Add an album event", icon: PlusCircle },
    { href: "/admin/faqs", label: "Edit FAQs", icon: HelpCircle },
    { href: "/admin/settings", label: "Update contact details", icon: Phone },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-primary/60">Assalamu alaikum{session ? `, ${session.username}` : ""}</p>
        <h1 className="mt-1 font-display text-3xl uppercase text-primary sm:text-4xl">Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="New inquiries"
          value={String(newInquiries)}
          hint={`${inquiries.length} total`}
          icon={Users}
          href="/admin/inbox?tab=inquiries"
          highlight={newInquiries > 0}
        />
        <StatCard
          label="New messages"
          value={String(newMessages)}
          hint={`${messages.length} total`}
          icon={MessageSquare}
          href="/admin/inbox?tab=messages"
        />
        <StatCard
          label="Published events"
          value={String(published)}
          hint="Visible on the Album page"
          icon={ImageIcon}
          href="/admin/album"
        />
        <StatCard
          label="Drafts to review"
          value={String(drafts)}
          hint="Not visible yet"
          icon={FileClock}
          href="/admin/album?tab=review"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Latest in the inbox</h2>
            <Link href="/admin/inbox" className="text-sm font-semibold text-primary hover:underline">
              Open inbox
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl bg-muted py-12 text-center text-primary/50">
              <Inbox className="size-7" />
              <p>No inquiries or messages yet.</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-primary/10">
              {recent.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/admin/inbox?tab=${entry.kind === "Inquiry" ? "inquiries" : "messages"}&open=${entry.id}`}
                    className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-muted"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                      {entry.kind === "Inquiry" ? <Users className="size-4" /> : <MessageSquare className="size-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-primary">{entry.name}</span>
                      <span className="block truncate text-sm text-primary/60">
                        {entry.kind} · {entry.detail}
                      </span>
                    </span>
                    <span className="hidden text-sm text-primary/50 sm:block">{timeAgo(entry.createdAt)}</span>
                    <InboxStatusPill status={entry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Quick actions</h2>
          <div className="mt-4 space-y-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex h-16 items-center gap-4 rounded-2xl border border-primary/10 px-5 font-medium text-primary transition-colors hover:border-primary/30 hover:bg-muted"
              >
                <action.icon className="size-5 text-primary/60" />
                <span className="flex-1">{action.label}</span>
                <ArrowUpRight className="size-4 text-primary/40" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
