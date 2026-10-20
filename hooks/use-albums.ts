import { useQuery } from "@tanstack/react-query";
import { albumKeys } from "@/lib/query-keys";
import { fetchAlbum, fetchAlbums } from "@/lib/api/albums";
import type { AlbumItem } from "@/lib/types";

export function useAlbums(category?: string) {
  return useQuery({
    queryKey: albumKeys.list(category),
    queryFn: () => fetchAlbums(category),
  });
}

export function useAlbum(id: string, initialData?: AlbumItem) {
  return useQuery({
    queryKey: albumKeys.detail(id),
    queryFn: () => fetchAlbum(id),
    initialData,
  });
}
