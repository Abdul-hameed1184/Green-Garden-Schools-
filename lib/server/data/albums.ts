import "server-only";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { after } from "next/server";
import { getSession } from "@/lib/auth";
import { Prisma, type Album as AlbumRow } from "@/lib/generated/prisma/client";
import { destroyImages, uploadDataUrls } from "@/lib/server/cloudinary";
import { db } from "@/lib/server/db";
import { newId } from "@/lib/server/ids";
import type { parseAlbumInput } from "@/lib/server/album-input";
import {
  ALBUM_CATEGORIES,
  type AlbumCategory,
  type AlbumHighlight,
  type AlbumItem,
  type AlbumPhoto,
} from "@/lib/types";

export const ALBUMS_TAG = "albums";

type AlbumInput = ReturnType<typeof parseAlbumInput>;

export interface AlbumSummary {
  id: string;
  title: string;
  category: AlbumCategory;
  coverSrc: string | null;
  eventDate: string;
  photoCount: number;
}

const toDate = (ymd: string) => new Date(`${ymd}T00:00:00.000Z`);
const toYmd = (date: Date) => date.toISOString().slice(0, 10);

function toAlbum(row: AlbumRow): AlbumItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    eventDate: toYmd(row.eventDate),
    location: row.location,
    description: row.description,
    coverSrc: row.coverSrc,
    highlights: row.highlights as unknown as AlbumHighlight[],
    photos: row.photos as unknown as AlbumPhoto[],
  };
}

const categoryFilter = (category?: string | null) =>
  category && ALBUM_CATEGORIES.includes(category as AlbumCategory)
    ? { category: category as AlbumCategory }
    : {};

async function queryAlbums(category: string | null | undefined, publishedOnly: boolean) {
  const rows = await db.album.findMany({
    where: { ...categoryFilter(category), ...(publishedOnly && { status: "Published" as const }) },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAlbum);
}

// Public reads are served from the Next data cache and invalidated on every album write.
const cachedPublishedAlbums = unstable_cache(
  (category: string) => queryAlbums(category, true),
  ["albums:published"],
  { tags: [ALBUMS_TAG] }
);

const cachedPublishedAlbum = unstable_cache(
  async (id: string) => {
    const row = await db.album.findFirst({ where: { id, status: "Published" } });
    return row ? toAlbum(row) : null;
  },
  ["albums:published-one"],
  { tags: [ALBUMS_TAG] }
);

/** Published summaries ordered by event date, for the event page's "next" and "related" links. */
export const listPublishedSummaries = unstable_cache(
  async (): Promise<AlbumSummary[]> => {
    const rows = await db.album.findMany({
      where: { status: "Published" },
      select: { id: true, title: true, category: true, coverSrc: true, eventDate: true, photos: true },
      orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
    });
    // Cached result keeps only the count, not the galleries.
    return rows.map(({ photos, eventDate, ...rest }) => ({
      ...rest,
      eventDate: toYmd(eventDate),
      photoCount: (photos as unknown as AlbumPhoto[]).length,
    }));
  },
  ["albums:published-summaries"],
  { tags: [ALBUMS_TAG] }
);

/** Admins see every status; the public sees Published only (cached). */
export async function listAlbums(category: string | null, isAdmin: boolean) {
  return isAdmin ? queryAlbums(category, false) : cachedPublishedAlbums(category ?? "All");
}

/** The event if the caller may see it: published for everyone, any status for admins. Memoised per request. */
export const findVisibleAlbum = cache(async (id: string): Promise<AlbumItem | null> => {
  const published = await cachedPublishedAlbum(id);
  if (published) return published;
  if (!(await getSession())) return null;
  const row = await db.album.findUnique({ where: { id } });
  return row ? toAlbum(row) : null;
});

/** Swaps data URLs in the input for hosted Cloudinary URLs. Returns the new URLs for rollback. */
async function persistImages(input: AlbumInput) {
  const uploaded = await uploadDataUrls([input.coverSrc, ...(input.photos ?? []).map((p) => p.src)]);
  if (uploaded.size === 0) return [];
  const swap = (src: string | null | undefined) => (src && uploaded.get(src)) || src;
  if (input.coverSrc !== undefined) input.coverSrc = swap(input.coverSrc) ?? null;
  input.photos = input.photos?.map((p) => ({ ...p, src: swap(p.src) ?? null }));
  return [...uploaded.values()];
}

/** Runs a write; if it throws, deletes the images uploaded for it so nothing is orphaned. */
async function withRollback<T>(uploadedUrls: string[], write: () => Promise<T>) {
  try {
    return await write();
  } catch (err) {
    if (uploadedUrls.length) after(() => destroyImages(uploadedUrls));
    throw err;
  }
}

const json = (value: unknown) => value as Prisma.InputJsonValue;

export async function createAlbum(
  input: AlbumInput & { title: string; category: AlbumCategory }
): Promise<AlbumItem> {
  const uploaded = await persistImages(input);
  const row = await withRollback(uploaded, () =>
    db.album.create({
      data: {
        id: newId("alb"),
        title: input.title,
        category: input.category,
        status: "Review",
        eventDate: toDate(input.eventDate ?? new Date().toISOString().slice(0, 10)),
        location: input.location ?? "",
        description: input.description ?? "",
        coverSrc: input.coverSrc ?? null,
        highlights: json(input.highlights ?? []),
        photos: json(input.photos ?? []),
      },
    })
  );
  revalidateTag(ALBUMS_TAG, { expire: 0 });
  return toAlbum(row);
}

const imageUrls = (album: { coverSrc: string | null; photos: unknown }) => [
  album.coverSrc,
  ...(album.photos as AlbumPhoto[]).map((p) => p.src),
];

/** Partial update; returns null when the album doesn't exist. */
export async function updateAlbum(id: string, input: AlbumInput): Promise<AlbumItem | null> {
  const touchesImages = input.coverSrc !== undefined || input.photos !== undefined;
  const before = touchesImages
    ? await db.album.findUnique({ where: { id }, select: { coverSrc: true, photos: true } })
    : null;
  if (touchesImages && !before) return null;

  const uploaded = await persistImages(input);
  const row = await withRollback(uploaded, () =>
    db.album.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.eventDate !== undefined && { eventDate: toDate(input.eventDate) }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.coverSrc !== undefined && { coverSrc: input.coverSrc }),
        ...(input.highlights !== undefined && { highlights: json(input.highlights) }),
        ...(input.photos !== undefined && { photos: json(input.photos) }),
      },
    })
  );
  revalidateTag(ALBUMS_TAG, { expire: 0 });

  if (before) {
    // Remove hosted images that the event no longer references, after responding.
    const kept = new Set(imageUrls(row));
    const dropped = imageUrls(before).filter((src) => src && !kept.has(src));
    if (dropped.length) after(() => destroyImages(dropped));
  }
  return toAlbum(row);
}

/** Returns false when the album doesn't exist. */
export async function deleteAlbum(id: string) {
  const row = await db.album
    .delete({ where: { id }, select: { coverSrc: true, photos: true } })
    .catch((err: unknown) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
      throw err;
    });
  if (!row) return false;
  revalidateTag(ALBUMS_TAG, { expire: 0 });
  after(() => destroyImages(imageUrls(row)));
  return true;
}
