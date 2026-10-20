"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Expand, ImageIcon } from "lucide-react";
import { AlbumImage } from "@/components/album/album-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import type { AlbumItem, AlbumPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Placeholder tiles get varied shapes so the masonry still has rhythm. */
const placeholderAspect = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-[3/4]", "aspect-[5/4]"];

function GalleryTile({
  photo,
  index,
  item,
  onOpen,
}: {
  photo: AlbumPhoto;
  index: number;
  item: AlbumItem;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const reveal = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const clipPath = useTransform(reveal, (v) => `inset(${(1 - v) * 25}% 0% 0% 0% round 1.5rem)`);
  const scale = useTransform(reveal, [0, 1], [1.3, 1]);
  const y = useTransform(reveal, [0, 1], [60, 0]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onOpen(index)}
      style={reduceMotion ? undefined : { clipPath, y }}
      className="group relative block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] bg-white text-left shadow-sm"
      aria-label={`Open photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
    >
      <div className={cn("overflow-hidden", !photo.src && placeholderAspect[index % placeholderAspect.length])}>
        <motion.div style={reduceMotion ? undefined : { scale }} className="h-full w-full">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <AlbumImage
              src={photo.src}
              alt={photo.caption || item.title}
              category={item.category}
              tone={index % 2 ? "lemon" : "deep"}
              className={photo.src ? "h-auto" : undefined}
            />
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {photo.caption && (
        <p className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {photo.caption}
        </p>
      )}
      <span className="absolute right-4 top-4 flex size-10 scale-50 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
        <Expand className="size-4" />
      </span>
    </motion.button>
  );
}

export function EventGallery({ item, onOpen }: { item: AlbumItem; onOpen: (index: number) => void }) {
  return (
    <section className="bg-muted py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SplitText
            as="h2"
            text={"Every\nMoment."}
            by="char"
            className="font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl lg:text-7xl"
          />
          <RevealOnScroll delay={0.2}>
            <p className="text-sm uppercase tracking-[0.2em] text-primary/60">
              {item.photos.length} photo{item.photos.length === 1 ? "" : "s"} · tap to enlarge
            </p>
          </RevealOnScroll>
        </div>

        {item.photos.length === 0 ? (
          <RevealOnScroll className="mt-16">
            <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-primary/20 py-24 text-center text-primary/50">
              <ImageIcon className="size-8" />
              <p>Photos from this event are coming soon.</p>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {item.photos.map((photo, i) => (
              <GalleryTile key={photo.id} photo={photo} index={i} item={item} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
