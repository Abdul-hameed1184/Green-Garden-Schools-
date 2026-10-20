"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";

export function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const headlineScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const blobA = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const blobB = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const blobC = useTransform(scrollYProgress, [0, 1], [-80, 120]);
  const spin = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden bg-secondary py-36 text-center lg:py-52"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          style={reduceMotion ? undefined : { y: blobA, rotate: spin }}
          className="absolute -left-24 top-10 size-72 rounded-[40%] bg-primary/10 lg:size-96"
        />
        <motion.div
          style={reduceMotion ? undefined : { y: blobB }}
          className="absolute -right-16 bottom-0 size-80 rounded-full border-[3rem] border-primary/10 lg:size-[28rem]"
        />
        <motion.div
          style={reduceMotion ? undefined : { y: blobC }}
          className="absolute left-1/4 bottom-16 size-10 rounded-full bg-accent/40"
        />
        <motion.div
          style={reduceMotion ? undefined : { y: blobA }}
          className="absolute right-1/4 top-20 size-6 rounded-full bg-primary/30"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <RevealOnScroll direction="up" y={30}>
          <span className="inline-flex rounded-full border border-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            Admissions Open
          </span>
        </RevealOnScroll>

        <motion.div style={reduceMotion ? undefined : { scale: headlineScale }}>
          <SplitText
            as="h2"
            text={"The Future\nStarts Here."}
            by="char"
            className="mt-8 font-display text-5xl uppercase leading-[0.9] text-primary sm:text-7xl lg:text-9xl"
          />
        </motion.div>

        <RevealOnScroll delay={0.2} blur>
          <p className="mx-auto mt-8 max-w-lg text-lg text-primary/70">
            Nurturing faith, excellence and character, one student at a time.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.35} scale>
          <Magnetic className="mt-12" strength={0.5}>
            <Button
              asChild
              size="lg"
              className="group h-16 rounded-full bg-primary px-10 text-base text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/admissions">
                Apply for Admission
                <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Button>
          </Magnetic>
        </RevealOnScroll>
      </div>
    </section>
  );
}
