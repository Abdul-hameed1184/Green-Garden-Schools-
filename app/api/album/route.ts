import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { parseAlbumInput } from "@/lib/server/album-input";
import { createAlbum, listAlbums } from "@/lib/server/data/albums";
import { handler } from "@/lib/server/http";
import { error, readJson, requireAdmin } from "@/lib/server/validate";

/** Public: published events, newest first. Admins also get drafts and archived events. */
export const GET = handler(async (request) => {
  const category = request.nextUrl.searchParams.get("category");
  const items = await listAlbums(category, Boolean(await getSession()));
  return NextResponse.json({ items });
});

/** Admin: create an event. It always starts as a draft ("Review"). */
export const POST = handler(async (request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const input = parseAlbumInput(await readJson(request));
  const { title, category } = input;
  if (!title || !category) return error("Title and category are required.", 400);

  const item = await createAlbum({ ...input, title, category });
  return NextResponse.json({ item }, { status: 201 });
});
