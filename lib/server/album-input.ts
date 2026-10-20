import "server-only";
import { newId } from "@/lib/server/ids";
import { str } from "@/lib/server/validate";
import {
  ALBUM_CATEGORIES,
  type AlbumCategory,
  type AlbumHighlight,
  type AlbumItem,
  type AlbumPhoto,
  type AlbumStatus,
} from "@/lib/types";

const statuses: AlbumStatus[] = ["Published", "Review", "Archived"];
const MAX_PHOTOS = 80;
const MAX_HIGHLIGHTS = 4;

type Editable = Partial<
  Pick<
    AlbumItem,
    | "title"
    | "category"
    | "status"
    | "eventDate"
    | "location"
    | "description"
    | "coverSrc"
    | "highlights"
    | "photos"
  >
>;

function src(value: unknown): string | null | undefined {
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  return /^(https?:\/\/|data:image\/|\/)/.test(value) ? value : undefined;
}

/**
 * Picks and validates the editable album fields from a request body.
 * Unknown or malformed fields are dropped rather than rejected.
 */
export function parseAlbumInput(body: unknown): Editable {
  if (!body || typeof body !== "object") return {};
  const b = body as Record<string, unknown>;
  const out: Editable = {};

  const title = str(b.title, 160);
  if (title) out.title = title;
  if (ALBUM_CATEGORIES.includes(b.category as AlbumCategory)) out.category = b.category as AlbumCategory;
  if (statuses.includes(b.status as AlbumStatus)) out.status = b.status as AlbumStatus;

  const eventDate = str(b.eventDate, 10);
  if (eventDate !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(eventDate)) out.eventDate = eventDate;

  const location = str(b.location, 160);
  if (location !== undefined) out.location = location;
  const description = str(b.description);
  if (description !== undefined) out.description = description;

  const cover = src(b.coverSrc);
  if (cover !== undefined) out.coverSrc = cover;

  if (Array.isArray(b.highlights)) {
    out.highlights = b.highlights
      .flatMap((raw): AlbumHighlight[] => {
        if (!raw || typeof raw !== "object") return [];
        const h = raw as Record<string, unknown>;
        const value = str(h.value, 24);
        const label = str(h.label, 40);
        return value && label ? [{ value, label }] : [];
      })
      .slice(0, MAX_HIGHLIGHTS);
  }

  if (Array.isArray(b.photos)) {
    out.photos = b.photos.slice(0, MAX_PHOTOS).flatMap((raw): AlbumPhoto[] => {
      if (!raw || typeof raw !== "object") return [];
      const p = raw as Record<string, unknown>;
      return [
        {
          id: typeof p.id === "string" && p.id ? p.id : newId("pho"),
          src: src(p.src) ?? null,
          caption: str(p.caption, 200) ?? "",
        },
      ];
    });
  }

  return out;
}
