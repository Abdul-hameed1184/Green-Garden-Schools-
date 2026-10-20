"use client";

import { useRef, type ElementType } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/components/motion/easing";

interface SplitTextProps {
  /** Use "\n" to force line breaks. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Extra classes per line, by index (e.g. to colour the last line). */
  lineClassName?: (index: number) => string | undefined;
  by?: "word" | "char";
  /** "mount" plays immediately; "inView" plays in and out with the viewport. */
  trigger?: "mount" | "inView";
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Masked text reveal: every word sits in an overflow-hidden slot and its
 * letters (or the word itself) slide up into view, staggered.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  lineClassName,
  by = "word",
  trigger = "inView",
  delay = 0,
  stagger,
  duration = 1,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const active = trigger === "mount" || inView;

  const step = stagger ?? (by === "char" ? 0.025 : 0.06);

  const container: Variants = {
    hidden: { transition: { staggerChildren: step / 2, staggerDirection: -1 } },
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  const piece: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { y: "110%", rotate: 4, transition: { duration: 0.5, ease: easeOutExpo } },
        visible: { y: "0%", rotate: 0, transition: { duration, ease: easeOutExpo } },
      };

  const lines = text.split("\n");

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
      <motion.span
        ref={ref}
        aria-hidden
        className="block"
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        variants={container}
      >
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName?.(li))}>
            {line.split(" ").map((word, wi) => (
              <span
                key={wi}
                className="-mb-[0.12em] inline-block overflow-hidden whitespace-nowrap pb-[0.12em] align-bottom"
              >
                {by === "char" ? (
                  word.split("").map((char, ci) => (
                    <motion.span key={ci} variants={piece} className="inline-block origin-bottom-left">
                      {char}
                    </motion.span>
                  ))
                ) : (
                  <motion.span variants={piece} className="inline-block origin-bottom-left">
                    {word}
                  </motion.span>
                )}
                {wi < line.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
