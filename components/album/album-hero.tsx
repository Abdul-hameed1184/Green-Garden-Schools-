"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { Camera, Music4, Palette, Trophy } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { PageHero } from "@/components/shared/page-hero";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";
import { easeOutExpo } from "@/components/motion/easing";

const tiles = [
  { icon: Camera, tone: "deep", className: "left-[4%] top-[18%] w-40 rotate-[-8deg] lg:w-56", speed: -1.4 },
  { icon: Trophy, tone: "lemon", className: "right-[6%] top-[14%] w-36 rotate-[6deg] lg:w-52", speed: -2 },
  { icon: Palette, tone: "lemon", className: "bottom-[12%] left-[10%] hidden w-44 rotate-[5deg] sm:block lg:w-60", speed: -0.8 },
  { icon: Music4, tone: "deep", className: "bottom-[16%] right-[8%] hidden w-40 rotate-[-6deg] sm:block lg:w-48", speed: -1.8 },
] as const;

function FloatingTiles() {
  const reduceMotion = useReducedMotion();
  const { progress } = useHeroScrollOut();
  const y0 = useTransform(progress, [0, 1], [0, tiles[0].speed * 200]);
  const y1 = useTransform(progress, [0, 1], [0, tiles[1].speed * 200]);
  const y2 = useTransform(progress, [0, 1], [0, tiles[2].speed * 200]);
  const y3 = useTransform(progress, [0, 1], [0, tiles[3].speed * 200]);
  const ys = [y0, y1, y2, y3];

  return (
    <>
      {tiles.map((tile, i) => (
        <motion.div
          key={i}
          style={reduceMotion ? undefined : { y: ys[i] }}
          className={`absolute ${tile.className}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 + i * 0.12, ease: easeOutExpo }}
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, i % 2 ? 14 : -14, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <ImagePlaceholder
                icon={tile.icon}
                tone={tile.tone}
                className="aspect-[4/5] w-full rounded-2xl opacity-80 shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

export function AlbumHero() {
  return (
    <PageHero
      layout="center"
      eyebrow="Digital Archive"
      title={"The\nAlbum."}
      outlineLine={1}
      description="A living collection of moments, achievements and the vibrant spirit of our community. Open any event to relive it."
      background={<FloatingTiles />}
    />
  );
}
