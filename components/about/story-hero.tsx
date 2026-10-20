"use client";

import { Landmark } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHero } from "@/components/shared/page-hero";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";

/** Swap for a real campus photo, e.g. "/images/about-hero.jpg". */
const ABOUT_HERO_IMAGE: string | null = null;

function DriftingYear() {
  const reduceMotion = useReducedMotion();
  const { floatY } = useHeroScrollOut();
  return (
    <motion.p
      style={reduceMotion ? undefined : { y: floatY }}
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute -bottom-[4vw] left-0 font-display text-[30vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,249,157,0.12)] select-none"
    >
      2008
    </motion.p>
  );
}

export function StoryHero() {
  return (
    <PageHero
      tone="dark"
      eyebrow="Since 2008"
      title={"Our\nStory."}
      accentLine={1}
      description="Since 2008, Green Garden Schools has nurtured young Muslims in the heart of Lagos: rooted in the Qur'an and Sunnah, and ready for the world."
      image={{ src: ABOUT_HERO_IMAGE, alt: "Green Garden main campus", label: "Main Campus", icon: Landmark }}
      background={<DriftingYear />}
    />
  );
}
