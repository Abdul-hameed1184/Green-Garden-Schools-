"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ArrowLeft, CalendarDays, Images, MapPin } from "lucide-react";
import { AlbumImage, formatEventDate } from "@/components/album/album-image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SplitText } from "@/components/motion/split-text";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";
import { heroRise } from "@/components/shared/page-hero";
import type { AlbumItem } from "@/lib/types";

/** Full-bleed, pinned cover with the event title set over it. */
export function EventHero({ item }: { item: AlbumItem }) {
  const reduceMotion = useReducedMotion();
  const { progress, scale, radius, textY, textOpacity, dim } = useHeroScrollOut();
  const coverScale = useTransform(progress, [0, 1], [1, 1.15]);

  const meta = [
    { icon: CalendarDays, text: formatEventDate(item.eventDate) },
    item.location ? { icon: MapPin, text: item.location } : null,
    { icon: Images, text: `${item.photos.length} photo${item.photos.length === 1 ? "" : "s"}` },
  ].filter((m): m is NonNullable<typeof m> => m !== null);

  return (
    <section className="sticky top-0 z-0 h-svh overflow-hidden bg-primary">
      <motion.div
        style={reduceMotion ? undefined : { scale, borderRadius: radius }}
        className="relative h-full origin-top overflow-hidden bg-primary text-white"
      >
        <motion.div style={reduceMotion ? undefined : { scale: coverScale }} className="absolute inset-0">
          <ImageReveal trigger="mount" parallax={0} className="h-full w-full">
            <AlbumImage src={item.coverSrc} alt={item.title} category={item.category} />
          </ImageReveal>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        <motion.div
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-28 lg:px-10 lg:pb-20"
        >
          <motion.div {...heroRise(0.1)}>
            <Link
              href="/album"
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur transition-colors hover:bg-white hover:text-primary"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
              All events
            </Link>
          </motion.div>

          <motion.span
            {...heroRise(0.2)}
            className="mb-4 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            {item.category}
          </motion.span>

          <SplitText
            as="h1"
            text={item.title}
            by="char"
            trigger="mount"
            delay={0.3}
            className="max-w-5xl font-display text-[clamp(2.5rem,8vw,7.5rem)] uppercase leading-[0.9]"
          />

          <motion.ul {...heroRise(0.9)} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-secondary" />
                {text}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          aria-hidden
          style={{ opacity: reduceMotion ? 0 : dim }}
          className="pointer-events-none absolute inset-0 z-20 bg-primary"
        />
      </motion.div>
    </section>
  );
}
