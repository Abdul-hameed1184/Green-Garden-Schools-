"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import journeySeed from "@/data/journey.seed.json";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import type { JourneyMilestone } from "@/lib/types";
import { cn } from "@/lib/utils";

const journey = journeySeed as JourneyMilestone[];

function Milestone({ milestone, index }: { milestone: JourneyMilestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start 0.6", "start 0.4"] });
  const flip = index % 2 === 1;

  const yearX = useTransform(scrollYProgress, [0, 1], flip ? ["-12%", "12%"] : ["12%", "-12%"]);
  const dotScale = useTransform(pass, [0, 1], [0.4, 1]);
  const dotFill = useTransform(pass, [0, 1], ["rgba(217,249,157,0)", "rgba(217,249,157,1)"]);

  return (
    <div
      ref={ref}
      className="relative grid items-center gap-6 pl-12 lg:grid-cols-2 lg:gap-24 lg:pl-0"
    >
      {/* Node on the line */}
      <motion.span
        aria-hidden
        style={reduceMotion ? undefined : { scale: dotScale, backgroundColor: dotFill }}
        className="absolute left-4 top-3 size-5 -translate-x-1/2 rounded-full border-2 border-secondary bg-secondary lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2"
      />

      <div className={cn("overflow-hidden", flip ? "lg:order-2" : "lg:text-right")}>
        <motion.p
          style={reduceMotion ? undefined : { x: yearX }}
          className="font-display text-7xl leading-none text-transparent [-webkit-text-stroke:1.5px_var(--secondary)] sm:text-8xl lg:text-[10rem]"
        >
          {milestone.year}
        </motion.p>
      </div>

      <RevealOnScroll
        direction={flip ? "right" : "left"}
        y={80}
        blur
        className={cn(flip && "lg:order-1 lg:text-right")}
      >
        <div
          className={cn(
            "rounded-[1.75rem] border border-white/10 bg-white/5 p-7 backdrop-blur lg:max-w-md lg:p-9",
            flip && "lg:ml-auto"
          )}
        >
          {milestone.title && (
            <h3 className="font-display text-2xl uppercase text-secondary lg:text-3xl">
              {milestone.title}
            </h3>
          )}
          <p className="mt-3 text-primary-foreground/75">{milestone.description}</p>
        </div>
      </RevealOnScroll>
    </div>
  );
}

/** Vertical timeline whose spine draws itself as you scroll. */
export function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section className="relative overflow-hidden bg-primary py-28 text-primary-foreground lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <RevealOnScroll y={30}>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Since 2008
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text="Our Journey."
            by="char"
            className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl"
          />
        </div>

        <div ref={ref} className="relative mt-24 space-y-24 lg:space-y-32">
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-white/10 lg:left-1/2">
            <motion.div style={{ scaleY: line }} className="h-full w-full origin-top bg-secondary" />
          </div>
          {journey.map((milestone, i) => (
            <Milestone key={milestone.year} milestone={milestone} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
