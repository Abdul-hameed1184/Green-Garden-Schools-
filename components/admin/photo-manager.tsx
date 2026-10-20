"use client";

import { useRef, useState } from "react";
import { ImageIcon, ImagePlus, Link2, Loader2, Star, Trash2 } from "lucide-react";
import { AdminButton } from "@/components/admin/page-header";
import { fileToDataUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import type { AlbumInput } from "@/lib/types";

export type DraftPhoto = AlbumInput["photos"][number] & { key: string };

let keySeed = 0;
export const draftKey = () => `draft-${Date.now()}-${keySeed++}`;

interface PhotoManagerProps {
  photos: DraftPhoto[];
  onChange: (photos: DraftPhoto[]) => void;
  coverSrc: string | null;
  onCoverChange: (src: string | null) => void;
}

/** Admin gallery editor: upload or link photos, caption them and pick a cover. */
export function PhotoManager({ photos, onChange, coverSrc, onCoverChange }: PhotoManagerProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const added = await Promise.all(
        Array.from(files)
          .filter((file) => file.type.startsWith("image/"))
          .map(async (file) => ({
            key: draftKey(),
            src: await fileToDataUrl(file),
            caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          }))
      );
      onChange([...photos, ...added]);
      if (!coverSrc && added[0]) onCoverChange(added[0].src);
    } catch {
      setError("One or more images couldn't be read.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function addUrl() {
    const value = url.trim();
    if (!/^https?:\/\//.test(value)) {
      setError("Enter a full image URL starting with http(s)://");
      return;
    }
    setError(null);
    onChange([...photos, { key: draftKey(), src: value, caption: "" }]);
    if (!coverSrc) onCoverChange(value);
    setUrl("");
  }

  function update(key: string, caption: string) {
    onChange(photos.map((p) => (p.key === key ? { ...p, caption } : p)));
  }

  function remove(photo: DraftPhoto) {
    onChange(photos.filter((p) => p.key !== photo.key));
    if (photo.src && photo.src === coverSrc) onCoverChange(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <AdminButton onClick={() => fileInput.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Upload photos
        </AdminButton>
        <div className="flex min-w-64 flex-1 gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="h-12 min-w-0 flex-1 rounded-full border border-primary/15 bg-white px-5 text-[15px] text-primary outline-none placeholder:text-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <AdminButton variant="outline" onClick={addUrl} aria-label="Add image URL" className="px-4!">
            <Link2 className="size-4" />
          </AdminButton>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/20 py-12 text-center text-primary/50">
          <ImageIcon className="size-6" />
          <p className="text-sm">No photos yet. Upload some to build the gallery.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => {
            const isCover = Boolean(photo.src) && photo.src === coverSrc;
            return (
              <li key={photo.key} className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
                <div className="group relative aspect-[4/3] bg-muted">
                  {photo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs/data URLs
                    <img src={photo.src} alt={photo.caption} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary/30">
                      <ImageIcon className="size-6" />
                    </div>
                  )}
                  {isCover && (
                    <span className="absolute left-2 top-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                      Cover
                    </span>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    {photo.src && !isCover && (
                      <button
                        type="button"
                        onClick={() => onCoverChange(photo.src)}
                        aria-label="Set as cover"
                        className="flex size-9 items-center justify-center rounded-full bg-white/90 text-primary shadow"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(photo)}
                      aria-label="Remove photo"
                      className="flex size-9 items-center justify-center rounded-full bg-white/90 text-red-600 shadow"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  value={photo.caption}
                  onChange={(e) => update(photo.key, e.target.value)}
                  placeholder="Caption"
                  className={cn(
                    "h-12 w-full border-t border-primary/10 px-4 text-sm text-primary outline-none placeholder:text-primary/40 focus:bg-muted"
                  )}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
