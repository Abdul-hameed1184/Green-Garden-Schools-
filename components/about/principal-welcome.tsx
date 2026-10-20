"use client";

import { Quote, UserRound } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { SplitText } from "@/components/motion/split-text";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function PrincipalWelcome() {
  return (
    <section className="relative bg-background py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <RevealOnScroll direction="right" y={40}>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Our Belief
          </span>
        </RevealOnScroll>

        <ScrollRevealText
          className="mt-8 max-w-5xl text-3xl font-semibold leading-[1.2] tracking-tight text-primary sm:text-4xl lg:text-6xl"
          text="Education is not just about academic rigour. It is about nurturing the whole child: their iman, their akhlaq, their curiosity and the courage to lead."
        />

        <div className="mt-28 grid items-center gap-16 lg:mt-40 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <ImageReveal
              parallax={0.12}
              className="aspect-[4/5] w-full max-w-lg rounded-[2rem] shadow-2xl"
            >
              <ImagePlaceholder
                icon={UserRound}
                label="Principal"
                tone="lemon"
                className="h-full w-full"
              />
            </ImageReveal>

            <ParallaxLayer
              speed={-0.8}
              className="absolute -bottom-10 right-0 lg:-right-6"
            >
              <RevealOnScroll direction="left" delay={0.3}>
                <div className="rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-2xl">
                  <p className="font-display text-4xl text-secondary">18</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                    Years of nurturing
                  </p>
                </div>
              </RevealOnScroll>
            </ParallaxLayer>
          </div>

          <div>
            <RevealOnScroll scale>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Quote className="size-6" />
              </span>
            </RevealOnScroll>

            <SplitText
              as="h2"
              text={"A Welcome From\nThe Principal."}
              by="word"
              className="mt-6 font-display text-4xl uppercase leading-[0.95] text-primary sm:text-5xl"
              lineClassName={(i) => (i === 1 ? "text-accent" : undefined)}
            />

            <RevealOnScroll delay={0.15} blur>
              <p className="mt-8 text-lg text-primary/75">
                Assalamu alaikum wa rahmatullah. At Green Garden Schools, our mission is to
                raise God-conscious, curious and capable young Muslims, and to cultivate
                excellent character in every student who walks through our halls.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.25} blur>
              <p className="mt-4 text-lg text-primary/75">
                We provide a sanctuary for learning where the Qur&apos;an and Sunnah meet
                modern innovation. Our dedicated teachers work tirelessly, by the will of
                Allah, so our students are prepared to lead and thrive in an ever-changing
                world.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.35} direction="right">
              <div className="mt-10 flex items-center gap-4 border-t border-primary/10 pt-8">
                <span className="h-px w-12 bg-primary" />
                <div>
                  <p className="font-display text-xl uppercase text-primary">
                    Dr. Aishat Bello
                  </p>
                  <p className="text-sm uppercase tracking-[0.2em] text-primary/60">
                    School Principal
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
