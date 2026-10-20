import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findVisibleAlbum, listPublishedSummaries } from "@/lib/server/data/albums";
import { AlbumEvent } from "@/components/album/event/album-event";

export async function generateMetadata(props: PageProps<"/album/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  // Memoised per request: the page below reuses this lookup.
  const item = await findVisibleAlbum(id);
  return {
    title: item ? `${item.title} | The Album | Green Garden Schools` : "The Album | Green Garden Schools",
    description: item?.description || undefined,
  };
}

export default async function AlbumEventPage(props: PageProps<"/album/[id]">) {
  const { id } = await props.params;
  const [item, published] = await Promise.all([findVisibleAlbum(id), listPublishedSummaries()]);
  if (!item) notFound();

  const index = published.findIndex((entry) => entry.id === item.id);
  const next =
    index === -1 || published.length < 2 ? null : published[(index + 1) % published.length];

  // Related: same category first, then the most recent others.
  const others = published.filter((e) => e.id !== item.id && e.id !== next?.id);
  const related = [
    ...others.filter((e) => e.category === item.category),
    ...others.filter((e) => e.category !== item.category),
  ].slice(0, 3);

  return <AlbumEvent item={item} next={next} related={related} />;
}
