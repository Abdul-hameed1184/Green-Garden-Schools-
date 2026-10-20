import { useMutation, useQueryClient } from "@tanstack/react-query";
import { albumKeys } from "@/lib/query-keys";
import { createAlbumItem, deleteAlbumItem, updateAlbumItem } from "@/lib/api/albums";
import type { AlbumInput, AlbumItem, AlbumStatus } from "@/lib/types";

export function useCreateAlbumItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AlbumInput) => createAlbumItem(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: albumKeys.lists });
      const previous = queryClient.getQueriesData<AlbumItem[]>({ queryKey: albumKeys.lists });
      const optimisticItem: AlbumItem = {
        id: `optimistic-${Date.now()}`,
        ...input,
        photos: input.photos.map((photo, i) => ({ ...photo, id: photo.id ?? `optimistic-${i}` })),
        status: "Review",
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueriesData<AlbumItem[]>({ queryKey: albumKeys.lists }, (old) =>
        old ? [optimisticItem, ...old] : old
      );
      return { previous };
    },
    onError: (_err, _input, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: albumKeys.all }),
  });
}

export function useUpdateAlbumItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<AlbumInput & { status: AlbumStatus }>) =>
      updateAlbumItem(id, input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: albumKeys.all }),
  });
}

export function useDeleteAlbumItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAlbumItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: albumKeys.lists });
      const previous = queryClient.getQueriesData<AlbumItem[]>({ queryKey: albumKeys.lists });
      queryClient.setQueriesData<AlbumItem[]>({ queryKey: albumKeys.lists }, (old) =>
        old ? old.filter((item) => item.id !== id) : old
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: albumKeys.all }),
  });
}
