"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";
import { AlbumImage, formatEventDate } from "@/components/album/album-image";
import type { AlbumItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  item: AlbumItem;
  index: number;
  tall?: boolean;
}

/**
 * Event card with a scroll-scrubbed reveal: as it enters, the frame opens from a
 * narrow window, the cover zooms out and the text rises. Scrolling back reverses it.
 */
export function AlbumCard({ item, index, tall }: AlbumCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.45"] });
  const reveal = useSpring(enter, { stiffness: 140, damping: 30, mass: 0.3 });
  const clipPath = useTransform(
    reveal,
    (v) => `inset(${(1 - v) * 30}% ${(1 - v) * 10}% 0% ${(1 - v) * 10}% round 1.75rem)`
  );
  const imageScale = useTransform(reveal, [0, 1], [1.45, 1]);
  const rotate = useTransform(reveal, [0, 1], [index % 2 ? 4 : -4, 0]);
  const textY = useTransform(reveal, [0.4, 1], [40, 0]);
  const textOpacity = useTransform(reveal, [0.4, 1], [0, 1]);

  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(pass, [0, 1], ["-8%", "8%"]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const discX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const discY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        ref={ref}
        href={`/album/${item.id}`}
        onPointerMove={handleMove}
        className="group relative block md:cursor-none"
      >
        <motion.div
          style={reduceMotion ? undefined : { clipPath, rotate }}
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] bg-muted",
            tall ? "aspect-[4/5]" : "aspect-[5/4]"
          )}
        >
          <motion.div
            style={reduceMotion ? undefined : { y: drift, scale: imageScale }}
            className="absolute inset-x-0 -inset-y-[10%]"
          >
            <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
              <AlbumImage
                src={item.coverSrc}
                alt={item.title}
                category={item.category}
                tone={index % 2 ? "lemon" : "deep"}
              />
            </div>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 transition-opacity duration-500 group-hover:opacity-80" />

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary backdrop-blur">
            {item.category}
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Images className="size-3.5" /> {item.photos.length}
          </span>

          {/* Cursor-following disc */}
          <motion.span
            aria-hidden
            style={{ x: discX, y: discY }}
            className="pointer-events-none absolute left-0 top-0 hidden md:block"
          >
            <span className="flex size-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase tracking-[0.15em] text-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100">
              View
            </span>
          </motion.span>
        </motion.div>

        <motion.div
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="mt-5 flex items-start justify-between gap-4"
        >
          <div>
            <h3 className="font-display text-2xl uppercase leading-tight text-primary">{item.title}</h3>
            <p className="mt-1 text-sm text-primary/60">
              {formatEventDate(item.eventDate)}
              {item.location && ` · ${item.location}`}
            </p>
          </div>
          <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-all duration-500 group-hover:rotate-45 group-hover:bg-primary group-hover:text-secondary md:hidden">
            <ArrowUpRight className="size-4" />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
