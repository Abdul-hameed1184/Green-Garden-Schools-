"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Positive moves down while scrolling, negative moves up. 1 = ±100px. */
  speed?: number;
  /** Horizontal drift, same scale as `speed`. */
  xSpeed?: number;
  /** Degrees rotated across the full scroll range. */
  rotate?: number;
  /** [start, end] scale across the scroll range. */
  scale?: [number, number];
  /** Smooth the motion with a spring. */
  smooth?: boolean;
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.15,
  xSpeed = 0,
  rotate = 0,
  scale,
  smooth = true,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sprung = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = smooth ? sprung : scrollYProgress;

  const y = useTransform(progress, [0, 1], [-speed * 100, speed * 100]);
  const x = useTransform(progress, [0, 1], [-xSpeed * 100, xSpeed * 100]);
  const r = useTransform(progress, [0, 1], [-rotate / 2, rotate / 2]);
  const s = useTransform(progress, [0, 1], scale ?? [1, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        style={reduceMotion ? undefined : { y, x, rotate: r, scale: s }}
      >
        {children}
      </motion.div>
    </div>
  );
}
