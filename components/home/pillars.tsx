"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BookOpen, HeartHandshake, MoonStar, Trophy, type LucideIcon } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SplitText } from "@/components/motion/split-text";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

interface Pillar {
  title: string;
  body: string;
  icon: LucideIcon;
  tone: "deep" | "lemon" | "muted";
}

const pillars: Pillar[] = [
  {
    title: "Faith",
    body: "Qur'an, Tajweed, Arabic and Islamic Studies woven into every day, with prayer at its heart.",
    icon: MoonStar,
    tone: "deep",
  },
  {
    title: "Academics",
    body: "Rigorous, inquiry-led learning that builds deep understanding, not just good grades.",
    icon: BookOpen,
    tone: "lemon",
  },
  {
    title: "Sports",
    body: "Teamwork, resilience and the joy of movement across a dozen disciplines.",
    icon: Trophy,
    tone: "deep",
  },
  {
    title: "Akhlaq",
    body: "Good character modelled on the Sunnah: honesty, kindness, service and respect.",
    icon: HeartHandshake,
    tone: "lemon",
  },
];

function PillarCard({
  pillar,
  index,
  progress,
}: {
  pillar: Pillar;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  // Image drifts against the track direction for depth.
  const imageX = useTransform(progress, [0, 1], ["-12%", "12%"]);
  const lift = useTransform(progress, [0, 1], [index % 2 ? 40 : -40, index % 2 ? -40 : 40]);

  return (
    <motion.article
      style={reduceMotion ? undefined : { y: lift }}
      className="group relative flex h-[62vh] w-[78vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl sm:w-[55vw] lg:h-[66vh] lg:w-[34vw]"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          style={reduceMotion ? undefined : { x: imageX }}
          className="absolute -inset-x-[15%] inset-y-0 transition-transform duration-700 group-hover:scale-105"
        >
          <ImagePlaceholder
            icon={pillar.icon}
            label={pillar.title}
            tone={pillar.tone}
            className="h-full w-full"
          />
        </motion.div>
        <span
          className={`absolute left-5 top-5 font-display text-6xl ${
            pillar.tone === "deep" ? "text-secondary" : "text-primary"
          }`}
        >
          0{index + 1}
        </span>
      </div>
      <div className="p-6 lg:p-8">
        <h3 className="font-display text-3xl uppercase text-primary">{pillar.title}</h3>
        <p className="mt-2 text-primary/70">{pillar.body}</p>
      </div>
    </motion.article>
  );
}

/**
 * Pinned horizontal-scroll gallery: the section is tall, its viewport sticks,
 * and vertical scroll translates the card track sideways.
 */
export function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (v) => -v * distance.current);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      distance.current = Math.max(track.scrollWidth - window.innerWidth, 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 h-[320vh] bg-muted">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-6 px-6 lg:gap-10 lg:px-10">
          <div className="flex w-[78vw] shrink-0 flex-col justify-center sm:w-[50vw] lg:w-[36vw]">
            <RevealOnScroll direction="right" y={40}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                The Green Garden Way
              </span>
            </RevealOnScroll>
            <SplitText
              as="h2"
              text={"Four\nPillars."}
              by="char"
              className="mt-6 font-display text-6xl uppercase leading-[0.9] text-primary sm:text-7xl lg:text-8xl"
            />
            <RevealOnScroll delay={0.2} blur>
              <p className="mt-6 max-w-sm text-lg text-primary/70">
                A whole-child Islamic education, built on four foundations. Keep scrolling.
              </p>
            </RevealOnScroll>
          </div>

          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>

        <div className="absolute inset-x-6 bottom-8 h-px bg-primary/15 lg:inset-x-10">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-primary" />
        </div>
      </div>
    </section>
  );
}
