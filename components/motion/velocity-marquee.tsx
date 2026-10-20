"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityMarqueeProps {
  children: ReactNode;
  className?: string;
  /** Percent of the track per second; negative scrolls right. */
  baseVelocity?: number;
  /** Skew the row with scroll speed. */
  skew?: boolean;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Infinite marquee that speeds up, reverses and skews with scroll velocity.
 * Children are rendered twice so the loop is seamless.
 */
export function VelocityMarquee({
  children,
  className,
  baseVelocity = 3,
  skew = true,
}: VelocityMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(factor));
    baseX.set(baseX.get() - move);
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max flex-nowrap"
        style={{ x, skewX: skew && !reduceMotion ? skewX : 0 }}
      >
        <div className="flex shrink-0 flex-nowrap">{children}</div>
        <div className="flex shrink-0 flex-nowrap" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
