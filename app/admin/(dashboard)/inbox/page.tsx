"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, ChevronDown, Inbox, Mail, Phone, Reply, Trash2 } from "lucide-react";
import { PageHeader, AdminButton } from "@/components/admin/page-header";
import { InboxStatusPill } from "@/components/admin/inbox-status-pill";
import {
  useAdmissionsInquiries,
  useContactMessages,
  useDeleteInboxEntry,
  useSetInboxStatus,
} from "@/hooks/use-inquiries";
import type { InboxStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "inquiries" | "messages";
type Filter = "all" | InboxStatus;

interface Entry {
  id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  body: string;
  meta: string[];
  status: InboxStatus;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function InboxRow({
  entry,
  kind,
  open,
  onToggle,
}: {
  entry: Entry;
  kind: "inquiry" | "message";
  open: boolean;
  onToggle: () => void;
}) {
  const setStatus = useSetInboxStatus(kind);
  const remove = useDeleteInboxEntry(kind);

  // Opening a new entry marks it as read.
  const { mutate: mutateStatus } = setStatus;
  useEffect(() => {
    if (open && entry.status === "new") mutateStatus({ id: entry.id, status: "read" });
  }, [open, entry.id, entry.status, mutateStatus]);

  function handleDelete() {
    if (confirm(`Delete this ${kind} from ${entry.name}? This can't be undone.`)) remove.mutate(entry.id);
  }

  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-shadow",
        open ? "border-primary/25 shadow-md" : "border-primary/10 shadow-sm"
      )}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span
          className={cn("size-2.5 shrink-0 rounded-full", entry.status === "new" ? "bg-accent" : "bg-transparent")}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-primary", entry.status === "new" ? "font-bold" : "font-semibold")}>
            {entry.name}
          </span>
          <span className="block truncate text-sm text-primary/60">{entry.summary}</span>
        </span>
        <span className="hidden text-sm text-primary/50 md:block">{formatDate(entry.createdAt)}</span>
        <InboxStatusPill status={entry.status} />
        <ChevronDown className={cn("size-5 shrink-0 text-primary/40 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-5 border-t border-primary/10 px-5 py-5">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary/70">
                <a href={`mailto:${entry.email}`} className="inline-flex items-center gap-2 hover:underline">
                  <Mail className="size-4" /> {entry.email}
                </a>
                {entry.phone && (
                  <a href={`tel:${entry.phone}`} className="inline-flex items-center gap-2 hover:underline">
                    <Phone className="size-4" /> {entry.phone}
                  </a>
                )}
                {entry.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
                <span className="md:hidden">{formatDate(entry.createdAt)}</span>
              </div>
              {entry.body ? (
                <p className="whitespace-pre-wrap rounded-2xl bg-muted p-5 leading-relaxed text-primary">{entry.body}</p>
              ) : (
                <p className="text-sm text-primary/50">No message was included.</p>
              )}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${entry.email}?subject=${encodeURIComponent("Re: your message to Green Garden Schools")}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Reply className="size-4" /> Reply by email
                </a>
                {entry.status !== "handled" ? (
                  <AdminButton variant="outline" onClick={() => setStatus.mutate({ id: entry.id, status: "handled" })}>
                    <CheckCheck className="size-4" /> Mark as handled
                  </AdminButton>
                ) : (
                  <AdminButton variant="outline" onClick={() => setStatus.mutate({ id: entry.id, status: "read" })}>
                    Reopen
                  </AdminButton>
                )}
                <AdminButton variant="danger" onClick={handleDelete} disabled={remove.isPending}>
                  <Trash2 className="size-4" /> Delete
                </AdminButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function InboxView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "messages" ? "messages" : "inquiries";
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(params.get("open"));

  const { data: inquiries = [], isLoading: loadingInquiries } = useAdmissionsInquiries();
  const { data: messages = [], isLoading: loadingMessages } = useContactMessages();

  const entries: Entry[] =
    tab === "inquiries"
      ? inquiries.map((i) => ({
          id: i.id,
          name: `${i.firstName} ${i.lastName}`,
          email: i.email,
          phone: i.phone,
          summary: i.gradeLevel ? `Applying for ${i.gradeLevel}` : i.email,
          body: i.message,
          meta: i.gradeLevel ? [`Level: ${i.gradeLevel}`] : [],
          status: i.status,
          createdAt: i.createdAt,
        }))
      : messages.map((m) => ({
          id: m.id,
          name: m.fullName,
          email: m.email,
          phone: m.phone,
          summary: m.subject ? `${m.subject} · ${m.message}` : m.message,
          body: m.message,
          meta: m.subject ? [`Subject: ${m.subject}`] : [],
          status: m.status,
          createdAt: m.createdAt,
        }));

  const visible = filter === "all" ? entries : entries.filter((e) => e.status === filter);
  const isLoading = tab === "inquiries" ? loadingInquiries : loadingMessages;
  const counts = {
    inquiries: inquiries.filter((i) => i.status === "new").length,
    messages: messages.filter((m) => m.status === "new").length,
  };

  function setTab(next: Tab) {
    setOpenId(null);
    router.replace(`${pathname}?tab=${next}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inbox"
        description="Admissions inquiries and contact messages from the website. Open one to mark it read, reply, or mark it handled."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full border border-primary/10 bg-white p-1.5">
          {(["inquiries", "messages"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "relative flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors",
                tab === t ? "text-primary-foreground" : "text-primary/70 hover:text-primary"
              )}
            >
              {tab === t && (
                <motion.span layoutId="inbox-tab" className="absolute inset-0 rounded-full bg-primary" />
              )}
              <span className="relative capitalize">{t === "inquiries" ? "Admissions inquiries" : "Contact messages"}</span>
              {counts[t] > 0 && (
                <span className="relative rounded-full bg-secondary px-2 text-xs font-bold text-primary">
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["all", "new", "read", "handled"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-10 rounded-full border px-4 text-sm font-medium capitalize transition-colors",
                filter === f ? "border-primary bg-primary/5 text-primary" : "border-primary/10 bg-white text-primary/60 hover:text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-primary/50">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-white/60 py-20 text-center text-primary/50">
          <Inbox className="size-8" />
          <p>{entries.length === 0 ? "Nothing here yet. Submissions from the website appear here." : "No entries match this filter."}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((entry) => (
            <InboxRow
              key={entry.id}
              entry={entry}
              kind={tab === "inquiries" ? "inquiry" : "message"}
              open={openId === entry.id}
              onToggle={() => setOpenId(openId === entry.id ? null : entry.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense>
      <InboxView />
    </Suspense>
  );
}
