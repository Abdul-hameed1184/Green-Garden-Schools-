"use client";

import { useState } from "react";
import { EventHero } from "@/components/album/event/event-hero";
import { EventIntro } from "@/components/album/event/event-intro";
import { EventReel } from "@/components/album/event/event-reel";
import { EventGallery } from "@/components/album/event/event-gallery";
import { EventLightbox } from "@/components/album/event/event-lightbox";
import { MoreEvents } from "@/components/album/event/more-events";
import { NextEvent, type EventSummary } from "@/components/album/event/next-event";
import { SlideOver } from "@/components/shared/slide-over";
import { useAlbum } from "@/hooks/use-albums";
import type { AlbumItem } from "@/lib/types";

interface AlbumEventProps {
  item: AlbumItem;
  next: EventSummary | null;
  related: EventSummary[];
}

export function AlbumEvent({ item: initialItem, next, related }: AlbumEventProps) {
  // Server-rendered data seeds the query so admin edits show up on refetch.
  const { data: item = initialItem } = useAlbum(initialItem.id, initialItem);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <EventHero item={item} />
      <SlideOver>
        <EventIntro item={item} />
        {item.photos.length >= 3 && <EventReel item={item} onOpen={setOpenIndex} />}
        <EventGallery item={item} onOpen={setOpenIndex} />
        {related.length > 0 && <MoreEvents events={related} />}
        {next && <NextEvent next={next} />}
      </SlideOver>

      <EventLightbox
        item={item}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
