import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/api/contact";

export function useContactMutation() {
  return useMutation({ mutationFn: submitContactMessage });
}
