"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ExternalLink, ImageIcon, Images, Pencil, Trash2 } from "lucide-react";
import { StatusPill } from "@/components/admin/status-pill";
import { AlbumFormDialog } from "@/components/admin/album-form-dialog";
import { formatEventDate } from "@/components/album/album-image";
import { useDeleteAlbumItem, useUpdateAlbumItem } from "@/hooks/use-album-mutations";
import type { AlbumItem } from "@/lib/types";

const iconButton =
  "flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors";

export function MemoryCard({ item }: { item: AlbumItem }) {
  const deleteItem = useDeleteAlbumItem();
  const updateItem = useUpdateAlbumItem();

  function handleRemove() {
    if (confirm(`Delete "${item.title}" and all its photos? This can't be undone.`)) {
      deleteItem.mutate(item.id);
    }
  }

  const isPublished = item.status === "Published";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/15 to-secondary/40">
        {item.coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-provided URL or data URL
          <img src={item.coverSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            <ImageIcon className="size-8" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <StatusPill status={item.status} />
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-primary/55">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {formatEventDate(item.eventDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Images className="size-4" /> {item.photos.length} photos
          </span>
        </p>

        <div className="mt-auto space-y-2 pt-5">
          <button
            type="button"
            disabled={updateItem.isPending}
            onClick={() => updateItem.mutate({ id: item.id, status: isPublished ? "Review" : "Published" })}
            className={`h-11 w-full rounded-full text-sm font-semibold transition-colors ${
              isPublished
                ? "border border-primary/15 text-primary hover:bg-muted"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isPublished ? "Unpublish (move to drafts)" : "Publish to website"}
          </button>
          <div className="flex gap-2">
            <AlbumFormDialog
              item={item}
              trigger={
                <button type="button" className={`${iconButton} border-primary/15 text-primary hover:bg-muted`}>
                  <Pencil className="size-4" /> Edit
                </button>
              }
            />
            <Link
              href={`/album/${item.id}`}
              target="_blank"
              className={`${iconButton} border-primary/15 text-primary hover:bg-muted`}
            >
              <ExternalLink className="size-4" /> View
            </Link>
            <button
              type="button"
              onClick={handleRemove}
              disabled={deleteItem.isPending}
              aria-label="Delete event"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
