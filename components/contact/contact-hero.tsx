"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHero } from "@/components/shared/page-hero";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";
import { useSiteSettings } from "@/hooks/use-settings";

const lagosTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function LagosClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <span className="font-mono tabular-nums">{now ? lagosTime.format(now) : "--:--:--"}</span>
  );
}

function FloatingRings() {
  const reduceMotion = useReducedMotion();
  const { floatY, rotate } = useHeroScrollOut();
  return (
    <>
      <motion.div
        style={reduceMotion ? undefined : { y: floatY, rotate }}
        className="absolute -right-24 top-24 size-72 rounded-full border-[2.5rem] border-secondary/50 lg:size-[26rem]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -24, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-[12%] size-16 rounded-2xl bg-accent/30"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[20%] top-32 size-5 rounded-full bg-primary/40"
      />
    </>
  );
}

export function ContactHero() {
  const { data: settings } = useSiteSettings();
  return (
    <PageHero
      layout="center"
      eyebrow="We'd love to hear from you"
      title={"Get In\nTouch."}
      outlineLine={1}
      background={<FloatingRings />}
      description="Whether you're a prospective parent, an alumnus, or simply curious about Green Garden Schools, our doors (and inboxes) are open."
    >
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary/70">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1c7d51] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#1c7d51]" />
          </span>
          Lagos, <LagosClock />
        </span>
        {settings?.officeHours && <span>Office hours: {settings.officeHours}</span>}
      </div>
    </PageHero>
  );
}
