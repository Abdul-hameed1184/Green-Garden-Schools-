import { request } from "@/lib/api/request";
import type { SiteSettings } from "@/lib/types";

export async function fetchSettings(): Promise<SiteSettings> {
  return (await request<{ settings: SiteSettings }>("/api/settings")).settings;
}

export async function updateSettings(input: Partial<SiteSettings>) {
  return (await request<{ settings: SiteSettings }>("/api/settings", { method: "PATCH", body: input }))
    .settings;
}
