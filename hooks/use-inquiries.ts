import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboxKeys } from "@/lib/query-keys";
import { deleteInquiry, fetchInquiries, updateInquiryStatus } from "@/lib/api/inquiries";
import { deleteMessage, fetchContactMessages, updateMessageStatus } from "@/lib/api/contact";
import type { InboxStatus } from "@/lib/types";

export function useAdmissionsInquiries() {
  return useQuery({ queryKey: inboxKeys.inquiries, queryFn: fetchInquiries });
}

export function useContactMessages() {
  return useQuery({ queryKey: inboxKeys.messages, queryFn: fetchContactMessages });
}

type Kind = "inquiry" | "message";

/** Change an inbox entry's status (new → read → handled), optimistically. */
export function useSetInboxStatus(kind: Kind) {
  const queryClient = useQueryClient();
  const key = kind === "inquiry" ? inboxKeys.inquiries : inboxKeys.messages;
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InboxStatus }): Promise<void> => {
      if (kind === "inquiry") await updateInquiryStatus(id, status);
      else await updateMessageStatus(id, status);
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ id: string; status: InboxStatus }[]>(key);
      queryClient.setQueryData<{ id: string; status: InboxStatus }[]>(key, (old) =>
        old?.map((entry) => (entry.id === id ? { ...entry, status } : entry))
      );
      return { previous };
    },
    onError: (_e, _v, context) => queryClient.setQueryData(key, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteInboxEntry(kind: Kind) {
  const queryClient = useQueryClient();
  const key = kind === "inquiry" ? inboxKeys.inquiries : inboxKeys.messages;
  return useMutation({
    mutationFn: (id: string) => (kind === "inquiry" ? deleteInquiry(id) : deleteMessage(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ id: string }[]>(key);
      queryClient.setQueryData<{ id: string }[]>(key, (old) => old?.filter((e) => e.id !== id));
      return { previous };
    },
    onError: (_e, _v, context) => queryClient.setQueryData(key, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
