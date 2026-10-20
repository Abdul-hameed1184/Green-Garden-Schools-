"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function KineticWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["-8%", "4%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["4%", "-8%"]);

  return (
    <div ref={ref} className="overflow-hidden py-16 select-none">
      <motion.p
        style={{ x: xLeft }}
        className="whitespace-nowrap font-display text-[18vw] uppercase leading-none text-primary/5"
      >
        Green Garden Green Garden
      </motion.p>
      <motion.p
        style={{ x: xRight }}
        className="whitespace-nowrap font-display text-[18vw] uppercase leading-none text-primary/5"
      >
        Schools Schools Schools
      </motion.p>
    </div>
  );
}
