"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AlbumImage } from "@/components/album/album-image";
import { SplitText } from "@/components/motion/split-text";
import type { AlbumItem, AlbumPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_REEL = 8;
const shapes = [
  "h-[58vh] w-[70vw] sm:w-[42vw] lg:w-[34vw]",
  "h-[44vh] w-[60vw] sm:w-[32vw] lg:w-[24vw] self-end",
  "h-[52vh] w-[66vw] sm:w-[38vw] lg:w-[30vw] self-start",
  "h-[40vh] w-[56vw] sm:w-[30vw] lg:w-[22vw] self-center",
];

function ReelPhoto({
  photo,
  index,
  item,
  progress,
  onOpen,
}: {
  photo: AlbumPhoto;
  index: number;
  item: AlbumItem;
  progress: MotionValue<number>;
  onOpen: (index: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const innerX = useTransform(progress, [0, 1], ["-10%", "10%"]);
  const y = useTransform(progress, [0, 1], [index % 2 ? 50 : -50, index % 2 ? -50 : 50]);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      style={reduceMotion ? undefined : { y }}
      aria-label={`Open photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
      className={cn("group relative shrink-0 overflow-hidden rounded-[1.75rem] text-left", shapes[index % shapes.length])}
    >
      <motion.div style={reduceMotion ? undefined : { x: innerX }} className="absolute -inset-x-[12%] inset-y-0">
        <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
          <AlbumImage src={photo.src} alt={photo.caption || item.title} category={item.category} tone={index % 2 ? "lemon" : "deep"} />
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 font-mono text-sm text-white/80">{String(index + 1).padStart(2, "0")}</span>
      {photo.caption && (
        <p className="absolute inset-x-0 bottom-0 p-5 font-semibold text-white">{photo.caption}</p>
      )}
    </motion.button>
  );
}

/** Pinned filmstrip: vertical scroll slides the first photos past sideways. */
export function EventReel({ item, onOpen }: { item: AlbumItem; onOpen: (index: number) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);
  const photos = item.photos.slice(0, MAX_REEL);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (v) => -v * distance.current);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      distance.current = Math.max(track.scrollWidth - window.innerWidth, 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary text-primary-foreground"
      style={{ height: `${100 + photos.length * 40}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex h-[70vh] w-max items-center gap-6 px-6 lg:gap-10 lg:px-10">
          <div className="flex w-[70vw] shrink-0 flex-col justify-center sm:w-[40vw] lg:w-[30vw]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Highlights reel</p>
            <SplitText
              as="h2"
              text={"Through\nThe Day."}
              by="char"
              className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl"
            />
            <p className="mt-6 max-w-xs text-primary-foreground/70">Keep scrolling to move through the moments. Tap a photo to enlarge it.</p>
          </div>
          {photos.map((photo, i) => (
            <ReelPhoto key={photo.id} photo={photo} index={i} item={item} progress={scrollYProgress} onOpen={onOpen} />
          ))}
        </motion.div>

        <div className="absolute inset-x-6 bottom-8 h-px bg-white/15 lg:inset-x-10">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-secondary" />
        </div>
      </div>
    </section>
  );
}
