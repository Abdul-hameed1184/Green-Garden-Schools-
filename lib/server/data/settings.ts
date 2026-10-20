import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import settingsSeed from "@/data/settings.seed.json";
import type { Prisma, SiteSettings as SettingsRow } from "@/lib/generated/prisma/client";
import { db } from "@/lib/server/db";
import type { SiteSettings } from "@/lib/types";

export const SETTINGS_TAG = "settings";
const ROW_ID = 1;

type Socials = SiteSettings["socials"];

export type SettingsPatch = Partial<Omit<SiteSettings, "socials">> & {
  socials?: Partial<Socials>;
};

const defaults = settingsSeed as SiteSettings;

function toSettings(row: SettingsRow): SiteSettings {
  return {
    phonePrimary: row.phonePrimary,
    phoneSecondary: row.phoneSecondary,
    emailGeneral: row.emailGeneral,
    emailAdmissions: row.emailAdmissions,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    officeHours: row.officeHours,
    mapUrl: row.mapUrl,
    socials: { ...defaults.socials, ...(row.socials as Partial<Socials>) },
  };
}

/** Public contact details, cached until the next settings write. Falls back to the seed if the row is missing. */
export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const row = await db.siteSettings.findUnique({ where: { id: ROW_ID } });
    return row ? toSettings(row) : defaults;
  },
  ["settings"],
  { tags: [SETTINGS_TAG] }
);

/** Applies a validated partial update; socials are merged key by key. */
export async function updateSettings({ socials, ...fields }: SettingsPatch): Promise<SiteSettings> {
  // Serializable so concurrent edits merge socials in turn instead of clobbering each other.
  const row = await db.$transaction(
    async (tx) => {
      const current = await tx.siteSettings.findUnique({ where: { id: ROW_ID } });
      const base = current ? toSettings(current) : defaults;
      const merged = { ...base, ...fields, socials: { ...base.socials, ...socials } };
      const data = { ...merged, socials: merged.socials as Prisma.InputJsonValue };
      return tx.siteSettings.upsert({
        where: { id: ROW_ID },
        create: { id: ROW_ID, ...data },
        update: data,
      });
    },
    { isolationLevel: "Serializable" }
  );
  revalidateTag(SETTINGS_TAG, { expire: 0 });
  return toSettings(row);
}
