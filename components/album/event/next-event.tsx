"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AlbumImage } from "@/components/album/album-image";
import type { AlbumItem } from "@/lib/types";

export type EventSummary = Pick<AlbumItem, "id" | "title" | "category" | "coverSrc" | "eventDate"> & {
  photoCount: number;
};

/** Oversized "next event" link that closes every event page. */
export function NextEvent({ next }: { next: EventSummary }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);

  return (
    <Link
      ref={ref}
      href={`/album/${next.id}`}
      className="group relative block overflow-hidden bg-primary py-28 text-primary-foreground lg:py-40"
    >
      <motion.div
        style={reduceMotion ? undefined : { scale: imageScale }}
        className="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50"
      >
        <AlbumImage src={next.coverSrc} alt="" category={next.category} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Next event</p>
        <motion.div
          style={reduceMotion ? undefined : { x }}
          className="mt-6 flex items-center gap-6 lg:gap-10"
        >
          <h2 className="font-display text-5xl uppercase leading-[0.9] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 sm:text-7xl lg:text-9xl">
            {next.title}
          </h2>
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-700 group-hover:-rotate-45 lg:size-24">
            <ArrowRight className="size-6 lg:size-8" />
          </span>
        </motion.div>
      </div>
    </Link>
  );
}
