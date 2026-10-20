"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
} from "framer-motion";
import stepsSeed from "@/data/admissionsSteps.seed.json";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { easeOutExpo } from "@/components/motion/easing";
import type { AdmissionsStep } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = stepsSeed as AdmissionsStep[];

function StepCard({
  step,
  index,
  active,
  onActive,
}: {
  step: AdmissionsStep;
  index: number;
  active: boolean;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-[60vh] items-center">
      <motion.article
        animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : 24 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className={cn(
          "w-full rounded-[2rem] border p-8 transition-colors duration-500 lg:p-12",
          active ? "border-primary bg-primary text-primary-foreground shadow-2xl" : "border-primary/15 bg-white text-primary"
        )}
      >
        <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", active ? "text-secondary" : "text-primary/50")}>
          Step {String(step.step).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-display text-3xl uppercase lg:text-5xl">{step.title}</h3>
        <p className={cn("mt-4 max-w-lg text-lg", active ? "text-primary-foreground/75" : "text-primary/60")}>
          {step.description}
        </p>
      </motion.article>
    </div>
  );
}

/** Steps scroll past on the right while a pinned counter on the left tracks progress. */
export function AdmissionsProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="relative scroll-mt-24 bg-background py-28 lg:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              How It Works
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text={"Admissions\nProcess."}
            by="char"
            className="mt-6 font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl lg:text-7xl"
          />

          <div className="mt-12 hidden items-end gap-6 lg:flex">
            <div className="relative h-40 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease: easeOutExpo }}
                  className="block font-display text-[10rem] leading-none text-primary"
                >
                  0{active + 1}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="mb-6 flex-1">
              <p className="text-sm uppercase tracking-[0.2em] text-primary/50">
                of 0{steps.length}
              </p>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-primary/10">
                <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-primary" />
              </div>
            </div>
          </div>
        </div>

        <div ref={ref}>
          {steps.map((step, i) => (
            <StepCard
              key={step.step}
              step={step}
              index={i}
              active={active === i}
              onActive={setActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
