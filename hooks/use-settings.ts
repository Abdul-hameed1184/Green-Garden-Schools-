import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import settingsSeed from "@/data/settings.seed.json";
import { settingsKeys } from "@/lib/query-keys";
import { fetchSettings, updateSettings } from "@/lib/api/settings";
import type { SiteSettings } from "@/lib/types";

export function useSiteSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: fetchSettings,
    placeholderData: settingsSeed as SiteSettings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (settings) => queryClient.setQueryData(settingsKeys.all, settings),
  });
}
