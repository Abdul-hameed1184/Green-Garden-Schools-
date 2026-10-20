"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import { easeOutExpo } from "@/components/motion/easing";
import { cn } from "@/lib/utils";
import { useFaqs } from "@/hooks/use-faqs";

export function ContactFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const { data: faqs = [] } = useFaqs();
  if (faqs.length === 0) return null;

  return (
    <section className="bg-background py-28 lg:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-10">
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <SplitText
            as="h2"
            text={"Good\nQuestions."}
            by="char"
            className="font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl"
          />
          <RevealOnScroll delay={0.2} blur>
            <p className="mt-6 max-w-sm text-lg text-primary/70">
              Quick answers to the things parents ask us most.
            </p>
          </RevealOnScroll>
        </div>

        <ul className="border-t border-primary/10">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <RevealOnScroll key={faq.id} delay={0.08 * i} y={30}>
                <li className="border-b border-primary/10">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span className="text-lg font-semibold text-primary transition-transform duration-500 group-hover:translate-x-2 lg:text-2xl">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                        isOpen
                          ? "rotate-45 border-primary bg-primary text-secondary"
                          : "border-primary/20 text-primary"
                      )}
                    >
                      <Plus className="size-5" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: easeOutExpo }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 text-primary/70">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </RevealOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
