import { NextResponse } from "next/server";
import { getSettings, updateSettings, type SettingsPatch } from "@/lib/server/data/settings";
import { handler } from "@/lib/server/http";
import { error, isEmail, readJson, requireAdmin, str } from "@/lib/server/validate";

const textFields = [
  "phonePrimary",
  "phoneSecondary",
  "addressLine1",
  "addressLine2",
  "officeHours",
] as const;
const socialKeys = ["instagram", "facebook", "x", "linkedin"] as const;

function isUrlOrEmpty(value: string) {
  return value === "" || /^https?:\/\//.test(value);
}

/** Public: contact details used by the Contact page and footer. */
export const GET = handler(async () => {
  return NextResponse.json({ settings: await getSettings() });
});

/** Admin: partial update. Only the fields sent are changed. */
export const PATCH = handler(async (request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  if (!body) return error("Body must be a JSON object.", 400);

  const patch: SettingsPatch = {};

  for (const key of textFields) {
    const value = str(body[key], 200);
    if (value !== undefined) patch[key] = value;
  }
  for (const key of ["emailGeneral", "emailAdmissions"] as const) {
    const value = str(body[key], 160);
    if (value === undefined) continue;
    if (!isEmail(value)) return error(`${key} must be a valid email address.`, 400);
    patch[key] = value;
  }
  const mapUrl = str(body.mapUrl, 500);
  if (mapUrl !== undefined) {
    if (!isUrlOrEmpty(mapUrl)) return error("mapUrl must start with http(s)://", 400);
    patch.mapUrl = mapUrl;
  }
  if (body.socials && typeof body.socials === "object") {
    const socials = body.socials as Record<string, unknown>;
    patch.socials = {};
    for (const key of socialKeys) {
      const value = str(socials[key], 300);
      if (value === undefined) continue;
      if (!isUrlOrEmpty(value)) return error(`socials.${key} must start with http(s)://`, 400);
      patch.socials[key] = value;
    }
  }

  return NextResponse.json({ settings: await updateSettings(patch) });
});
