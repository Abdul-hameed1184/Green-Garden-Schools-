"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { easeOutExpo } from "@/components/motion/easing";

const levels = [
  { level: "Crèche", ages: "1–2 years" },
  { level: "Nursery", ages: "3–5 years" },
  { level: "Primary", ages: "6–11 years" },
  { level: "Junior Secondary", ages: "11–14 years" },
  { level: "Senior Secondary", ages: "14–17 years" },
  { level: "Hifz Track", ages: "From age 6" },
];

const documents = [
  "Completed application form",
  "Copy of birth certificate",
  "Two recent passport photographs",
  "Most recent school report (Primary and above)",
  "Transfer letter from previous school, if applicable",
  "Immunisation / medical record",
];

/** Age guide and document checklist: replaces the old public fee table. */
export function AdmissionRequirements() {
  return (
    <section id="requirements" className="relative scroll-mt-24 bg-muted py-28 lg:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-10">
        <div>
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Before You Apply
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text={"Admission\nRequirements."}
            by="char"
            className="mt-6 font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl"
          />
          <RevealOnScroll delay={0.2} blur>
            <p className="mt-6 max-w-sm text-lg text-primary/70">
              Everything you need to prepare. For information on school fees, please speak
              with our admissions team directly.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3} className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/60">
              Age guide
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {levels.map((l) => (
                <div key={l.level} className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <dt className="font-semibold text-primary">{l.level}</dt>
                  <dd className="text-sm text-primary/60">{l.ages}</dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>

        <RevealOnScroll scale className="h-fit overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="bg-primary px-8 py-6 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Checklist</p>
            <p className="mt-1 font-display text-2xl uppercase">Documents to bring</p>
          </div>
          <ul className="divide-y divide-primary/10">
            {documents.map((doc, i) => (
              <motion.li
                key={doc}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: easeOutExpo }}
                className="group relative flex items-center gap-4 px-8 py-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-secondary/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <Check className="size-4" />
                </span>
                <span className="relative text-[17px] text-primary">{doc}</span>
              </motion.li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
