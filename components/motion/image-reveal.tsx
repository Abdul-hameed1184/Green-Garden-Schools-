"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { easeInOutQuart } from "@/components/motion/easing";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "mount" wipes in immediately; "inView" wipes in and out with the viewport. */
  trigger?: "mount" | "inView";
  /** Inner scroll parallax as a fraction of the frame height. */
  parallax?: number;
  from?: "bottom" | "top" | "left" | "right";
}

const hiddenClip = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Clip-path wipe for imagery. The content zooms from 1.3 to 1 as it is
 * revealed and drifts inside its frame while scrolling.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  trigger = "inView",
  parallax = 0.1,
  from = "bottom",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.15 });
  const active = trigger === "mount" || inView;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-parallax * 100}%`, `${parallax * 100}%`]
  );

  const transition = { duration: 1.3, delay: active ? delay : 0, ease: easeInOutQuart };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? { opacity: 0 } : { clipPath: hiddenClip[from] }}
        animate={
          reduceMotion
            ? { opacity: active ? 1 : 0 }
            : { clipPath: active ? "inset(0% 0% 0% 0%)" : hiddenClip[from] }
        }
        transition={transition}
      >
        <motion.div
          className="absolute inset-x-0 -inset-y-[12%]"
          style={reduceMotion ? undefined : { y }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={reduceMotion ? false : { scale: 1.3 }}
            animate={reduceMotion ? undefined : { scale: active ? 1 : 1.3 }}
            transition={{ ...transition, duration: 1.6 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
