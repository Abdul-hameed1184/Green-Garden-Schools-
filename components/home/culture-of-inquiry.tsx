"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Microscope } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { SplitText } from "@/components/motion/split-text";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

const stats = [
  { value: 98, suffix: "%", label: "University Acceptance" },
  { value: 15, suffix: ":1", label: "Student-Teacher Ratio" },
  { value: 18, suffix: "", label: "Years of Excellence" },
];

export function CultureOfInquiry() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["15%", "-45%"]);
  const wordX2 = useTransform(scrollYProgress, [0, 1], ["-40%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden rounded-t-[2.5rem] bg-primary py-28 text-primary-foreground shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.35)] lg:rounded-t-[4rem] lg:py-40"
    >
      {/* Drifting outline type behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between py-10 select-none">
        <motion.p
          style={reduceMotion ? undefined : { x: wordX }}
          className="whitespace-nowrap font-display text-[18vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,249,157,0.14)]"
        >
          Inquiry Curiosity
        </motion.p>
        <motion.p
          style={reduceMotion ? undefined : { x: wordX2 }}
          className="whitespace-nowrap font-display text-[18vw] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,249,157,0.1)]"
        >
          Wonder Discovery
        </motion.p>
      </div>

      <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <div className="relative">
          <ImageReveal
            parallax={0.12}
            className="aspect-[4/5] w-full rounded-[2rem] border border-white/10 shadow-2xl"
          >
            <ImagePlaceholder
              icon={GraduationCap}
              label="Classroom"
              tone="deep"
              className="h-full w-full"
            />
          </ImageReveal>

          <ParallaxLayer
            speed={-0.9}
            rotate={-10}
            className="absolute -bottom-12 -right-4 w-40 sm:w-52 lg:-right-12"
          >
            <ImageReveal
              from="left"
              delay={0.25}
              parallax={0.08}
              className="aspect-square w-full rounded-3xl border-4 border-primary shadow-2xl"
            >
              <ImagePlaceholder
                icon={Microscope}
                label="Labs"
                tone="lemon"
                className="h-full w-full"
              />
            </ImageReveal>
          </ParallaxLayer>
        </div>

        <div>
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
              Our Philosophy
            </span>
          </RevealOnScroll>

          <SplitText
            as="h2"
            text={"A Culture\nOf Inquiry."}
            by="word"
            className="mt-6 font-display text-5xl uppercase leading-[0.95] sm:text-6xl lg:text-7xl"
            lineClassName={(i) => (i === 1 ? "text-secondary" : undefined)}
          />

          <RevealOnScroll delay={0.2} blur>
            <p className="mt-8 max-w-md text-lg text-primary-foreground/75">
              The first word revealed was &ldquo;Iqra&rdquo;: read. We foster an environment
              where questions are celebrated and knowledge is a form of worship, preparing
              the leaders of tomorrow with both deen and dunya.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {stats.map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={0.15 * i} scale>
                <p className="font-display text-4xl text-secondary lg:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-primary-foreground/60 sm:text-sm">
                  {stat.label}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
