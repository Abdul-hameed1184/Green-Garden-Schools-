"use client";

import { Asterisk } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";

const subjects = [
  "Qur'an & Tajweed",
  "Arabic",
  "Islamic Studies",
  "Mathematics",
  "Literature",
  "Robotics",
  "Life Sciences",
  "Visual Arts",
  "Languages",
  "Music",
  "Computer Science",
  "Physical Education",
  "Hifz Programme",
  "Environmental Studies",
  "History",
  "Design Technology",
];

const verbs = ["Read", "Reflect", "Discover", "Create", "Build", "Lead"];

export function CuriousMinds() {
  return (
    <section className="relative z-10 overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              45+ Subjects
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text={"Curious\nMinds."}
            by="char"
            className="mt-6 font-display text-6xl uppercase leading-[0.9] text-primary sm:text-7xl lg:text-8xl"
          />
        </div>
        <RevealOnScroll delay={0.2} blur className="max-w-sm">
          <p className="text-lg text-primary/70">
            From Qur&apos;an and Arabic to robotics and the sciences, every subject is a
            doorway. Scroll faster and watch the curriculum race by.
          </p>
        </RevealOnScroll>
      </div>

      <div className="relative mt-20 space-y-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent lg:w-48" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent lg:w-48" />

        <RevealOnScroll direction="left" y={120}>
          <VelocityMarquee baseVelocity={2.5}>
            {subjects.map((subject) => (
              <span
                key={subject}
                className="mr-4 whitespace-nowrap rounded-full border border-primary/15 bg-muted px-7 py-4 text-base font-medium text-primary transition-all duration-500 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
              >
                {subject}
              </span>
            ))}
          </VelocityMarquee>
        </RevealOnScroll>

        <RevealOnScroll direction="right" y={120} delay={0.1}>
          <VelocityMarquee baseVelocity={-2}>
            {verbs.map((verb) => (
              <span
                key={verb}
                className="flex items-center gap-8 whitespace-nowrap pr-8 font-display text-7xl uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_var(--primary)] transition-colors duration-500 hover:text-primary lg:text-9xl"
              >
                {verb}
                <Asterisk className="size-12 text-accent lg:size-20" strokeWidth={2.5} />
              </span>
            ))}
          </VelocityMarquee>
        </RevealOnScroll>
      </div>
    </section>
  );
}
