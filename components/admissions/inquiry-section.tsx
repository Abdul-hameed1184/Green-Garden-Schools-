"use client";

import { CalendarCheck, Clock, MessageCircle } from "lucide-react";
import { DownloadCard } from "@/components/admissions/download-card";
import { InquiryForm } from "@/components/admissions/inquiry-form";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";

const promises = [
  { icon: Clock, text: "A reply from our admissions team within 48 hours" },
  { icon: CalendarCheck, text: "A personal campus tour at a time that suits you" },
  { icon: MessageCircle, text: "Honest answers about our curriculum, Islamic programme and fit" },
];

export function InquirySection() {
  return (
    <section
      id="inquiry"
      className="relative scroll-mt-24 overflow-hidden bg-primary py-28 text-primary-foreground lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 size-[40rem] rounded-full bg-[#1c7d51]/40 blur-3xl"
      />
      <div className="relative mx-auto grid grid-cols-1 max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <div>
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Inquiry Form
            </span>
          </RevealOnScroll>
          <SplitText
            as="h2"
            text={"Begin Your\nJourney."}
            by="char"
            className="mt-6 font-display text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl"
            lineClassName={(i) => (i === 1 ? "text-secondary" : undefined)}
          />

          <ul className="mt-10 space-y-5">
            {promises.map((promise, i) => (
              <RevealOnScroll key={promise.text} delay={0.1 * i} direction="right" y={30}>
                <li className="flex items-center gap-4 text-primary-foreground/80">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-secondary">
                    <promise.icon className="size-4" />
                  </span>
                  {promise.text}
                </li>
              </RevealOnScroll>
            ))}
          </ul>

          <RevealOnScroll delay={0.3} className="mt-12 max-w-sm">
            <DownloadCard title="School Prospectus" size="4.2 MB" href="/documents/prospectus-2024.pdf" />
          </RevealOnScroll>
        </div>

        <RevealOnScroll direction="left" y={60} delay={0.1}>
          <InquiryForm />
        </RevealOnScroll>
      </div>
    </section>
  );
}
