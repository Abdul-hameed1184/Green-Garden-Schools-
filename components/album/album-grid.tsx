"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { AlbumCard } from "@/components/album/album-card";
import { useColumns } from "@/hooks/use-columns";
import type { AlbumItem } from "@/lib/types";

/** Per-column travel (px) across the section: the middle column moves fastest. */
const travel: [number, number][] = [
  [60, -60],
  [260, -260],
  [140, -140],
];

/**
 * Masonry-style grid split into columns that scroll at different speeds,
 * so the album breathes as you move through it.
 */
export function AlbumGrid({ items }: { items: AlbumItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const columns = useColumns();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.4 });

  const y0 = useTransform(progress, [0, 1], travel[0]);
  const y1 = useTransform(progress, [0, 1], travel[1]);
  const y2 = useTransform(progress, [0, 1], travel[2]);
  const ys = [y0, y1, y2];

  const buckets: { item: AlbumItem; index: number }[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => buckets[index % columns].push({ item, index }));

  return (
    <div
      ref={ref}
      className="grid gap-x-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        // Room for the fastest column's travel so nothing overlaps the next section.
        paddingBlock: columns > 1 ? "8rem" : undefined,
      }}
    >
      {buckets.map((bucket, col) => (
        <motion.div
          key={col}
          style={reduceMotion || columns === 1 ? undefined : { y: ys[col] }}
          className="flex flex-col gap-16"
        >
          <AnimatePresence mode="popLayout">
            {bucket.map(({ item, index }) => (
              <AlbumCard key={item.id} item={item} index={index} tall={(index + col) % 2 === 1} />
            ))}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
