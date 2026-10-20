"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AlbumImage, formatEventDate } from "@/components/album/album-image";
import type { AlbumItem } from "@/lib/types";

/**
 * The latest event, pinned while its cover grows from a framed card to a
 * full-bleed image and the title rises over it.
 */
export function FeaturedEvent({ item }: { item: AlbumItem }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const clipPath = useTransform(scrollYProgress, [0, 0.6], [
    "inset(16% 18% 16% 18% round 2.5rem)",
    "inset(0% 0% 0% 0% round 0rem)",
  ]);
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.35, 1]);
  const titleY = useTransform(scrollYProgress, [0.25, 0.7], [120, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-background">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.p
          style={reduceMotion ? undefined : { opacity: labelOpacity }}
          className="absolute inset-x-0 top-[6%] z-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary/60"
        >
          Latest event · keep scrolling
        </motion.p>

        <Link href={`/album/${item.id}`} className="group absolute inset-0 block">
          <motion.div
            style={reduceMotion ? undefined : { clipPath }}
            className="absolute inset-0 overflow-hidden bg-primary"
          >
            <motion.div
              style={reduceMotion ? undefined : { scale: imageScale }}
              className="absolute inset-0 transition-transform duration-[1.5s]"
            >
              <AlbumImage src={item.coverSrc} alt={item.title} category={item.category} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

            <motion.div
              style={reduceMotion ? undefined : { y: titleY, opacity: titleOpacity }}
              className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-14 text-white lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-20"
            >
              <div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {item.category}
                </span>
                <h2 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-white/75">
                  {formatEventDate(item.eventDate)}
                  {item.location && ` · ${item.location}`} · {item.photos.length} photos
                </p>
              </div>
              <span className="flex h-16 w-fit items-center gap-3 rounded-full bg-white pl-7 pr-2 font-semibold text-primary transition-transform duration-500 group-hover:-translate-y-1">
                View event
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-secondary transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </span>
            </motion.div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
