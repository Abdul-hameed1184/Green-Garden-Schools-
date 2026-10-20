"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutQuart } from "@/components/motion/easing";

type Direction = "up" | "down" | "left" | "right";
type RevealState = "hidden" | "visible" | "exitTop";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  direction?: Direction;
  blur?: boolean;
  scale?: boolean;
  duration?: number;
  /** When false (default) the element animates out again as it leaves the viewport. */
  once?: boolean;
  amount?: number;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: distance };
  }
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 48,
  direction = "up",
  blur = false,
  scale = false,
  duration = 0.9,
  once = false,
  amount = 0.2,
}: RevealOnScrollProps) {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<RevealState>("hidden");
  const offset = offsetFor(direction, reduceMotion ? 0 : y);

  const resolved: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      ...(scale && !reduceMotion && { scale: 0.92 }),
      ...(blur && !reduceMotion && { filter: "blur(10px)" }),
      transition: { duration: 0.5, ease: easeOutQuart },
    },
    // Leaving past the top of the viewport: drift further up rather than snapping back down.
    exitTop: {
      opacity: 0,
      x: offset.x ? -offset.x * 0.5 : 0,
      y: offset.y ? -Math.abs(offset.y) * 0.6 : 0,
      ...(scale && !reduceMotion && { scale: 0.96 }),
      ...(blur && !reduceMotion && { filter: "blur(10px)" }),
      transition: { duration: 0.5, ease: easeOutQuart },
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(scale && { scale: 1 }),
      ...(blur && { filter: "blur(0px)" }),
      transition: { duration, delay, ease: easeOutQuart },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={state}
      variants={resolved}
      viewport={{ once, amount }}
      onViewportEnter={() => setState("visible")}
      onViewportLeave={(entry) =>
        setState(entry && entry.boundingClientRect.top < 0 ? "exitTop" : "hidden")
      }
    >
      {children}
    </motion.div>
  );
}

export { variants as revealVariants };
