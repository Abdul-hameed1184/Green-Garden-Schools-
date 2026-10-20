import { useMutation } from "@tanstack/react-query";
import { submitInquiry } from "@/lib/api/inquiries";

export function useInquiryMutation() {
  return useMutation({ mutationFn: submitInquiry });
}
