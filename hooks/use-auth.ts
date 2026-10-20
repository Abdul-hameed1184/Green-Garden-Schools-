import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys";
import { fetchSession, login, logout } from "@/lib/api/auth";

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: fetchSession,
    staleTime: 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, keyphrase }: { username: string; keyphrase: string }) =>
      login(username, keyphrase),
    onSuccess: (session) => queryClient.setQueryData(authKeys.session, session),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.setQueryData(authKeys.session, null),
  });
}
