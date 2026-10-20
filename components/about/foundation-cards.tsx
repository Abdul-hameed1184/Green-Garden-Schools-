"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Compass, Heart, Target, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { cn } from "@/lib/utils";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  accent: string;
}

const pillars: Pillar[] = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide a world-class education grounded in the Qur'an and Sunnah, empowering every student to reach their full potential and serve their community.",
    tone: "bg-primary text-primary-foreground",
    accent: "bg-secondary text-primary",
  },
  {
    icon: Compass,
    title: "Our Vision",
    description:
      "To be a leading Islamic school, recognised for academic excellence, strong iman and the outstanding character of its graduates.",
    tone: "bg-secondary text-primary",
    accent: "bg-primary text-secondary",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Taqwa (God-consciousness), Ihsan (excellence), Amanah (trustworthiness) and Rahmah (compassion) are at the heart of everything we do.",
    tone: "bg-white text-primary",
    accent: "bg-accent text-white",
  },
];

function StackCard({
  pillar,
  index,
  total,
  progress,
}: {
  pillar: Pillar;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  // Each card shrinks slightly as the ones after it stack on top.
  const targetScale = 1 - (total - 1 - index) * 0.06;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const Icon = pillar.icon;

  return (
    <div
      className="sticky flex h-[75vh] items-start justify-center"
      style={{ top: `calc(110px + ${index * 28}px)` }}
    >
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className={cn(
          "flex h-[60vh] min-h-[22rem] w-full origin-top flex-col justify-between rounded-[2rem] p-8 shadow-2xl lg:p-12",
          pillar.tone
        )}
      >
        <div className="flex items-start justify-between">
          <span className={cn("flex size-16 items-center justify-center rounded-2xl", pillar.accent)}>
            <Icon className="size-7" />
          </span>
          <span className="font-display text-7xl opacity-20 lg:text-9xl">0{index + 1}</span>
        </div>
        <div>
          <h3 className="font-display text-4xl uppercase lg:text-6xl">{pillar.title}</h3>
          <p className="mt-4 max-w-xl text-lg opacity-80">{pillar.description}</p>
        </div>
      </motion.article>
    </div>
  );
}

/** Mission / Vision / Values as sticky cards that stack while scrolling. */
export function FoundationCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="relative bg-muted py-28 lg:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What We Stand For
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text={"Our\nFoundation."}
            by="char"
            className="mt-6 font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl lg:text-7xl"
          />
          <RevealOnScroll delay={0.2} blur>
            <p className="mt-6 max-w-sm text-lg text-primary/70">
              Built on pillars that support the weight of a brilliant future.
            </p>
          </RevealOnScroll>
        </div>

        <div ref={ref}>
          {pillars.map((pillar, i) => (
            <StackCard
              key={pillar.title}
              pillar={pillar}
              index={i}
              total={pillars.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
