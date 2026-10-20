import { NextResponse } from "next/server";
import { parseAlbumInput } from "@/lib/server/album-input";
import { deleteAlbum, findVisibleAlbum, updateAlbum } from "@/lib/server/data/albums";
import { handler } from "@/lib/server/http";
import { error, readJson, requireAdmin } from "@/lib/server/validate";

type Ctx = RouteContext<"/api/album/[id]">;

/** Unpublished events are only visible to signed-in admins. */
export const GET = handler(async (_request, { params }: Ctx) => {
  const item = await findVisibleAlbum((await params).id);
  if (!item) return error("Not found.", 404);
  return NextResponse.json({ item });
});

export const PATCH = handler(async (request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [{ id }, body] = await Promise.all([params, readJson(request)]);
  const item = await updateAlbum(id, parseAlbumInput(body));
  if (!item) return error("Not found.", 404);
  return NextResponse.json({ item });
});

export const DELETE = handler(async (_request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!(await deleteAlbum((await params).id))) return error("Not found.", 404);
  return NextResponse.json({ ok: true });
});
