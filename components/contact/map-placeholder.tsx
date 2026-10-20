"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { easeOutExpo } from "@/components/motion/easing";
import { useSiteSettings } from "@/hooks/use-settings";

const roads = [
  "M-50 180 C 200 140, 380 260, 620 210 S 1000 120, 1500 190",
  "M-50 420 C 260 380, 520 470, 760 400 S 1180 330, 1500 380",
  "M340 -40 C 360 140, 300 300, 380 480 S 420 640, 400 760",
  "M980 -40 C 940 180, 1040 320, 960 520 S 900 680, 940 760",
  "M-50 600 C 320 560, 700 640, 1100 580 S 1350 540, 1500 560",
];


/** Stylised map: roads draw in on scroll, the grid drifts, the pin pulses. */
export function MapPlaceholder() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const draw = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const { data: settings } = useSiteSettings();

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[28rem] overflow-hidden bg-primary">
      <motion.svg
        aria-hidden
        style={reduceMotion ? undefined : { y: gridY }}
        className="absolute -inset-y-16 inset-x-0 h-[calc(100%+8rem)] w-full text-white/[0.06]"
      >
        <defs>
          <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </motion.svg>

      <svg
        aria-hidden
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {roads.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={i % 2 ? "rgba(217,249,157,0.35)" : "rgba(255,255,255,0.18)"}
            strokeWidth={i % 2 ? 10 : 5}
            strokeLinecap="round"
            style={{ pathLength: reduceMotion ? 1 : draw }}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-secondary/20 [animation-duration:2.4s]" />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="relative flex items-center gap-4 rounded-3xl bg-white p-4 pr-6 shadow-2xl"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-secondary">
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="font-bold text-primary">Green Garden Schools</p>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60">Main Campus</p>
          </div>
          {settings?.mapUrl && (
          <a
            href={settings.mapUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Get directions"
            className="ml-2 flex size-10 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-500 hover:rotate-45"
          >
            <ArrowUpRight className="size-4" />
          </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
