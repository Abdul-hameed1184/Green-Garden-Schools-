"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";
import { AlbumImage, formatEventDate } from "@/components/album/album-image";
import { SplitText } from "@/components/motion/split-text";
import { easeOutExpo } from "@/components/motion/easing";
import type { EventSummary } from "@/components/album/event/next-event";

export function MoreEvents({ events }: { events: EventSummary[] }) {
  return (
    <section className="bg-background py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitText
            as="h2"
            text={"More From\nThe Album."}
            by="char"
            className="font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl"
            lineClassName={(i) => (i === 1 ? "text-accent" : undefined)}
          />
          <Link href="/album" className="group inline-flex h-12 items-center gap-2 rounded-full border border-primary/20 px-6 font-semibold text-primary hover:bg-muted">
            All events <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 80, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 1, delay: i * 0.1, ease: easeOutExpo }}
            >
              <Link href={`/album/${event.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
                  <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                    <AlbumImage src={event.coverSrc} alt={event.title} category={event.category} tone={i % 2 ? "lemon" : "deep"} />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                    {event.category}
                  </span>
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    <Images className="size-3.5" /> {event.photoCount}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl uppercase text-primary transition-transform duration-500 group-hover:translate-x-2">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-primary/60">{formatEventDate(event.eventDate)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
