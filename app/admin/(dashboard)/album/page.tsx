"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, PlusCircle, Search } from "lucide-react";
import { AdminButton, PageHeader } from "@/components/admin/page-header";
import { MemoryCard } from "@/components/admin/memory-card";
import { AlbumFormDialog } from "@/components/admin/album-form-dialog";
import { useAlbums } from "@/hooks/use-albums";
import type { AlbumStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs: { value: string; label: string; status?: AlbumStatus }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published", status: "Published" },
  { value: "review", label: "Drafts", status: "Review" },
  { value: "archived", label: "Archived", status: "Archived" },
];

function AlbumManager() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = tabs.some((t) => t.value === params.get("tab")) ? params.get("tab")! : "all";
  const [query, setQuery] = useState("");
  const { data, isLoading } = useAlbums("All");
  const items = data ?? [];

  const activeStatus = tabs.find((t) => t.value === tab)?.status;
  const filtered = items
    .filter((item) => !activeStatus || item.status === activeStatus)
    .filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));

  function setTab(value: string) {
    router.replace(value === "all" ? pathname : `${pathname}?tab=${value}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Album"
        description="Each event has a cover, a story, key facts and a photo gallery. New events start as drafts; publish them when they're ready."
        actions={
          <AlbumFormDialog
            defaultOpen={params.get("new") === "1"}
            trigger={
              <AdminButton>
                <PlusCircle className="size-4" /> New event
              </AdminButton>
            }
          />
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full border border-primary/10 bg-white p-1.5">
          {tabs.map((t) => {
            const count = t.status ? items.filter((i) => i.status === t.status).length : items.length;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "relative h-11 rounded-full px-5 text-[15px] font-semibold transition-colors",
                  tab === t.value ? "text-primary-foreground" : "text-primary/70 hover:text-primary"
                )}
              >
                {tab === t.value && (
                  <motion.span layoutId="album-admin-tab" className="absolute inset-0 rounded-full bg-primary" />
                )}
                <span className="relative">
                  {t.label} <span className="opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
            className="h-12 w-full rounded-full border border-primary/15 bg-white pl-12 pr-4 text-[15px] text-primary outline-none placeholder:text-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
      </div>

      {isLoading ? (
        <p className="text-primary/50">Loading events…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-white/60 py-20 text-center text-primary/50">
          <ImageIcon className="size-8" />
          <p>No events here yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <MemoryCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function AlbumManagerPage() {
  return (
    <Suspense>
      <AlbumManager />
    </Suspense>
  );
}
