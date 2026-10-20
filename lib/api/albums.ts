import type { AlbumInput, AlbumItem, AlbumStatus } from "@/lib/types";

export async function fetchAlbums(category?: string): Promise<AlbumItem[]> {
  const url = category && category !== "All" ? `/api/album?category=${encodeURIComponent(category)}` : "/api/album";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load album items.");
  const data = await res.json();
  return data.items as AlbumItem[];
}

export async function fetchAlbum(id: string): Promise<AlbumItem> {
  const res = await fetch(`/api/album/${id}`);
  if (!res.ok) throw new Error("Failed to load this event.");
  const data = await res.json();
  return data.item as AlbumItem;
}

export async function createAlbumItem(input: AlbumInput): Promise<AlbumItem> {
  const res = await fetch("/api/album", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Failed to create item.");
  const data = await res.json();
  return data.item as AlbumItem;
}

export async function updateAlbumItem(
  id: string,
  input: Partial<AlbumInput & { status: AlbumStatus }>
): Promise<AlbumItem> {
  const res = await fetch(`/api/album/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Failed to update item.");
  const data = await res.json();
  return data.item as AlbumItem;
}

export async function deleteAlbumItem(id: string): Promise<void> {
  const res = await fetch(`/api/album/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).message ?? "Failed to remove item.");
}

export type { AlbumStatus };
