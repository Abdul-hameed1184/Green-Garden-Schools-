"use client";

import { useState, type ReactElement } from "react";
import { CalendarDays, MapPin, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminButton } from "@/components/admin/page-header";
import {
  FormError,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { PhotoManager, draftKey, type DraftPhoto } from "@/components/admin/photo-manager";
import { useCreateAlbumItem, useUpdateAlbumItem } from "@/hooks/use-album-mutations";
import {
  ALBUM_CATEGORIES,
  type AlbumCategory,
  type AlbumHighlight,
  type AlbumInput,
  type AlbumItem,
  type AlbumStatus,
} from "@/lib/types";

const statusOptions = [
  { value: "Review", label: "Draft (hidden from website)" },
  { value: "Published", label: "Published (visible on website)" },
  { value: "Archived", label: "Archived (hidden, kept for records)" },
];

interface AlbumFormDialogProps {
  trigger: React.ReactNode;
  item?: AlbumItem;
  defaultOpen?: boolean;
}

function initialState(item?: AlbumItem) {
  return {
    title: item?.title ?? "",
    category: item?.category ?? ("Faith" as AlbumCategory),
    status: item?.status ?? ("Review" as AlbumStatus),
    eventDate: item?.eventDate ?? new Date().toISOString().slice(0, 10),
    location: item?.location ?? "",
    description: item?.description ?? "",
    coverSrc: item?.coverSrc ?? null,
    highlights: (item?.highlights ?? []).map((h) => ({ ...h })),
    photos: (item?.photos ?? []).map((p): DraftPhoto => ({ ...p, key: p.id ?? draftKey() })),
  };
}

export function AlbumFormDialog({ trigger, item, defaultOpen = false }: AlbumFormDialogProps) {
  const isEdit = Boolean(item);
  const [open, setOpen] = useState(defaultOpen);
  const [form, setForm] = useState(() => initialState(item));

  const createItem = useCreateAlbumItem();
  const updateItem = useUpdateAlbumItem();
  const mutation = isEdit ? updateItem : createItem;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setHighlight(index: number, patch: Partial<AlbumHighlight>) {
    set(
      "highlights",
      form.highlights.map((h, i) => (i === index ? { ...h, ...patch } : h))
    );
  }

  function handleOpenChange(next: boolean) {
    // Re-sync with the latest saved data every time the dialog opens.
    if (next) setForm(initialState(item));
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: AlbumInput = {
      title: form.title,
      category: form.category,
      eventDate: form.eventDate,
      location: form.location,
      description: form.description,
      coverSrc: form.coverSrc,
      highlights: form.highlights.filter((h) => h.value.trim() && h.label.trim()),
      photos: form.photos.map(({ id, src, caption }) => ({ id, src, caption })),
    };

    if (isEdit && item) {
      updateItem.mutate({ id: item.id, ...payload, status: form.status }, { onSuccess: () => setOpen(false) });
    } else {
      createItem.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          setForm(initialState());
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as ReactElement} />
      <DialogContent showCloseButton={false} className="max-h-[92vh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b border-primary/10 bg-white px-6 py-5 sm:px-8">
          <DialogTitle className="font-display text-2xl uppercase text-primary">
            {isEdit ? "Edit event" : "New album event"}
          </DialogTitle>
          <DialogClose
            aria-label="Close"
            className="flex size-11 items-center justify-center rounded-full text-primary hover:bg-muted"
          >
            <X className="size-5" />
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6 sm:px-8">
          <FormSection title="Event details">
            <TextField
              id="memory-title"
              label="Event title"
              value={form.title}
              onChange={(v) => set("title", v)}
              required
              maxLength={160}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="memory-category"
                label="Category"
                value={form.category}
                onChange={(v) => set("category", v as AlbumCategory)}
                options={ALBUM_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
              <TextField
                id="memory-date"
                type="date"
                label="Event date"
                icon={CalendarDays}
                alwaysFloat
                value={form.eventDate}
                onChange={(v) => set("eventDate", v)}
                required
              />
            </div>
            <TextField
              id="memory-location"
              label="Location"
              icon={MapPin}
              value={form.location}
              onChange={(v) => set("location", v)}
              hint="e.g. Main Hall, School Grounds"
            />
            <TextAreaField
              id="memory-description"
              label="The story: what happened at this event?"
              value={form.description}
              onChange={(v) => set("description", v)}
            />
            {isEdit && (
              <SelectField
                id="memory-status"
                label="Visibility"
                value={form.status}
                onChange={(v) => set("status", v as AlbumStatus)}
                options={statusOptions}
              />
            )}
          </FormSection>

          <FormSection title="Key facts" description='Up to 4 short facts shown on the event page, e.g. "300+" / "Guests".'>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <TextField
                  id={`hl-value-${i}`}
                  label="Number / value"
                  value={h.value}
                  onChange={(v) => setHighlight(i, { value: v })}
                  maxLength={24}
                  className="w-40 shrink-0 sm:w-48"
                />
                <TextField
                  id={`hl-label-${i}`}
                  label="Label"
                  value={h.label}
                  onChange={(v) => setHighlight(i, { label: v })}
                  maxLength={40}
                  className="flex-1"
                />
                <button
                  type="button"
                  aria-label="Remove fact"
                  onClick={() => set("highlights", form.highlights.filter((_, j) => j !== i))}
                  className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {form.highlights.length < 4 && (
              <AdminButton
                variant="outline"
                onClick={() => set("highlights", [...form.highlights, { value: "", label: "" }])}
              >
                <Plus className="size-4" /> Add a fact
              </AdminButton>
            )}
          </FormSection>

          <FormSection
            title={`Photos (${form.photos.length})`}
            description="Upload photos or paste links. Add captions, and star one to make it the cover."
          >
            <PhotoManager
              photos={form.photos}
              onChange={(photos) => set("photos", photos)}
              coverSrc={form.coverSrc}
              onCoverChange={(src) => set("coverSrc", src)}
            />
          </FormSection>

          {!isEdit && (
            <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-primary/60">
              New events are saved as drafts. Use &quot;Publish to website&quot; on the event card when it&apos;s ready.
            </p>
          )}
          <FormError message={mutation.isError ? mutation.error.message : null} />

          <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 border-t border-primary/10 bg-white px-6 py-4 sm:-mx-8 sm:px-8">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Create event"}
            </AdminButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
