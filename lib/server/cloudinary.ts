import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { HttpError } from "@/lib/server/http";

const FOLDER = process.env.CLOUDINARY_FOLDER || "greengarden/albums";
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_CONCURRENCY = 5;

const configured = Boolean(CLOUD && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (configured) {
  cloudinary.config({
    cloud_name: CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const isDataUrl = (src: string | null | undefined): src is string =>
  typeof src === "string" && src.startsWith("data:image/");

/** Runs `fn` over `items` with at most `limit` in flight at once. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Serve the auto-selected format (WebP/AVIF) at auto quality. */
function deliveryUrl(secureUrl: string) {
  return secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

/**
 * Uploads every `data:image/...` source to Cloudinary (deduplicated, in
 * parallel) and returns a map of data URL → hosted URL. Other sources pass through.
 */
export async function uploadDataUrls(srcs: Array<string | null | undefined>) {
  const pending = [...new Set(srcs.filter(isDataUrl))];
  const uploaded = new Map<string, string>();
  if (pending.length === 0) return uploaded;
  if (!configured) throw new HttpError(503, "Image uploads are not configured on the server.");

  const results = await mapLimit(pending, UPLOAD_CONCURRENCY, (dataUrl) =>
    cloudinary.uploader
      .upload(dataUrl, { folder: FOLDER, resource_type: "image" })
      .then((res) => ({ ok: true as const, dataUrl, url: deliveryUrl(res.secure_url) }))
      .catch((err: unknown) => ({ ok: false as const, dataUrl, err }))
  );

  const failures: unknown[] = [];
  for (const r of results) {
    if (r.ok) uploaded.set(r.dataUrl, r.url);
    else failures.push(r.err);
  }
  if (failures.length) {
    // Don't leave half an upload batch behind.
    destroyImages([...uploaded.values()]).catch(() => {});
    console.error("[cloudinary] upload failed", failures[0]);
    throw new HttpError(502, "Couldn't upload one or more images. Please try again.");
  }
  return uploaded;
}

/** Cloudinary public_id for a URL we uploaded, or null for anything else. */
function publicIdOf(url: string) {
  if (!CLOUD) return null;
  const prefix = `https://res.cloudinary.com/${CLOUD}/image/upload/`;
  if (!url.startsWith(prefix)) return null;
  const segments = url.slice(prefix.length).split("/");
  // Drop transformation segments (contain "_" + ",") and the version segment (v123).
  while (segments.length && (/^v\d+$/.test(segments[0]) || /^[a-z]{1,3}_/.test(segments[0]))) {
    segments.shift();
  }
  const publicId = segments.join("/").replace(/\.[a-z0-9]+$/i, "");
  return publicId.startsWith(`${FOLDER}/`) ? publicId : null;
}

/** Deletes our hosted images for the given URLs; ignores URLs we don't own. */
export async function destroyImages(urls: Array<string | null | undefined>) {
  if (!configured) return;
  const ids = [...new Set(urls.flatMap((u) => (u ? publicIdOf(u) ?? [] : [])))];
  // delete_resources takes up to 100 ids per call.
  for (let i = 0; i < ids.length; i += 100) {
    await cloudinary.api
      .delete_resources(ids.slice(i, i + 100), { resource_type: "image" })
      .catch((err: unknown) => console.error("[cloudinary] delete failed", err));
  }
}
