"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AlbumFilterBar } from "@/components/album/album-filter-bar";
import { AlbumGrid } from "@/components/album/album-grid";
import { FeaturedEvent } from "@/components/album/featured-event";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { useAlbums } from "@/hooks/use-albums";

export function AlbumBrowser() {
  const [category, setCategory] = useState("All");
  // Always load everything once; filtering is client-side so the grid can animate.
  const { data, isLoading, isError } = useAlbums("All");
  const published = (data ?? [])
    .filter((item) => item.status === "Published")
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  const [featured, ...rest] = published;
  const listed = category === "All" ? rest : published.filter((i) => i.category === category);

  return (
    <>
      {featured && <FeaturedEvent item={featured} />}

      <section className="relative bg-background pb-16 pt-28 lg:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SplitText
              as="h2"
              text={"Moments\nWorth Keeping."}
              by="char"
              className="font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl lg:text-7xl"
              lineClassName={(i) => (i === 1 ? "text-accent" : undefined)}
            />
            <RevealOnScroll delay={0.2}>
              <p className="max-w-sm text-lg text-primary/70">
                {published.length} events and counting. Filter by category, then open any
                event to see the full story and every photo.
              </p>
            </RevealOnScroll>
          </div>

          <div className="sticky top-4 z-20 mt-12 flex justify-center">
            <div className="max-w-full rounded-full bg-background/70 p-1 shadow-lg backdrop-blur-xl">
              <AlbumFilterBar active={category} onChange={setCategory} />
            </div>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center py-24 text-primary/50">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : isError ? (
              <p className="py-24 text-center text-destructive">Couldn&apos;t load the album right now.</p>
            ) : listed.length === 0 ? (
              <p className="py-24 text-center text-primary/60">
                No {category === "All" ? "other" : category} events yet. Check back soon.
              </p>
            ) : (
              <AlbumGrid key={category} items={listed} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
