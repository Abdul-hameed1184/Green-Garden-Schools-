"use client";

import { useScroll, useTransform } from "framer-motion";

/**
 * Motion values for a pinned (sticky) page hero that recedes while the next
 * section slides over it. Progress runs 0 → 1 over the first viewport of scroll.
 */
export function useHeroScrollOut() {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (v) =>
    typeof window === "undefined" ? 0 : Math.min(v / window.innerHeight, 1)
  );

  return {
    progress,
    scale: useTransform(progress, [0, 1], [1, 0.88]),
    radius: useTransform(progress, [0, 1], [0, 48]),
    textY: useTransform(progress, [0, 1], [0, -180]),
    textOpacity: useTransform(progress, [0, 0.7], [1, 0]),
    imageY: useTransform(progress, [0, 1], [0, 120]),
    floatY: useTransform(progress, [0, 1], [0, -240]),
    rotate: useTransform(progress, [0, 1], [0, 180]),
    dim: useTransform(progress, [0, 1], [0, 0.6]),
  };
}
