import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import faqsSeed from "@/data/faqs.seed.json";
import { faqKeys } from "@/lib/query-keys";
import {
  createFaq,
  deleteFaq,
  fetchFaqs,
  reorderFaqs,
  updateFaq,
  type FaqInput,
} from "@/lib/api/faqs";
import type { FaqItem } from "@/lib/types";

export function useFaqs() {
  return useQuery({
    queryKey: faqKeys.all,
    queryFn: fetchFaqs,
    // Seed content renders instantly while the live list loads.
    placeholderData: faqsSeed as FaqItem[],
  });
}

function useFaqMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: faqKeys.all }),
  });
}

export const useCreateFaq = () => useFaqMutation((input: FaqInput) => createFaq(input));
export const useUpdateFaq = () =>
  useFaqMutation(({ id, ...input }: { id: string } & Partial<FaqInput>) => updateFaq(id, input));
export const useDeleteFaq = () => useFaqMutation((id: string) => deleteFaq(id));

export function useReorderFaqs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderFaqs,
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: faqKeys.all });
      const previous = queryClient.getQueryData<FaqItem[]>(faqKeys.all);
      if (previous) {
        const byId = new Map(previous.map((f) => [f.id, f]));
        queryClient.setQueryData(faqKeys.all, ids.map((id) => byId.get(id)!).filter(Boolean));
      }
      return { previous };
    },
    onError: (_e, _v, context) => queryClient.setQueryData(faqKeys.all, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: faqKeys.all }),
  });
}
