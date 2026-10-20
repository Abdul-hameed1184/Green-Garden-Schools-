"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";
import { HERO_GUTTER as GUTTER, heroRise as rise } from "@/components/shared/page-hero";
import { easeOutExpo } from "@/components/motion/easing";

/**
 * HERO IMAGE: drop a photo in /public/images and point this at it
 * (e.g. "/images/hero.jpg"). While null, a styled placeholder is shown.
 */
const HERO_IMAGE_SRC: string | null = null;

const BADGE_TEXT = "GREEN GARDEN SCHOOLS • EST. 2008 • ";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const {
    scale,
    radius,
    textY,
    textOpacity,
    imageY,
    floatY: cardY,
    rotate: badgeRotate,
    dim,
  } = useHeroScrollOut();

  return (
    <section className="sticky top-0 z-0 h-svh overflow-hidden bg-primary">
      <motion.div
        style={reduceMotion ? undefined : { scale, borderRadius: radius }}
        className="relative h-full origin-top overflow-hidden bg-background"
      >
        {/* Ambient background shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -left-40 top-1/4 size-[36rem] rounded-full bg-secondary/40 blur-3xl"
            animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,83,45,0.05)_1px,transparent_1px)] bg-[size:8rem_100%]" />
        </div>

        <div className="relative grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[1.15fr_1fr] lg:grid-rows-1">
          {/* Copy */}
          <motion.div
            style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
            className={`relative z-10 flex flex-col justify-center px-6 pb-6 pt-28 lg:pb-0 lg:pr-12 lg:pt-0 ${GUTTER}`}
          >
            <motion.div
              {...rise(0.1)}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-muted/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur"
            >
              <Sparkles className="size-3.5" />
              An Islamic School · Est. 2008
            </motion.div>

            <SplitText
              as="h1"
              text={"Nurturing\nLegends."}
              by="char"
              trigger="mount"
              delay={0.25}
              className="font-display text-[clamp(2rem,8.8vw,4.5rem)] lg:text-[min(5.2vw,5.25rem)] uppercase leading-[0.88] text-primary"
              lineClassName={(i) =>
                i === 1 ? "text-transparent [-webkit-text-stroke:2px_var(--primary)]" : undefined
              }
            />

            <motion.p {...rise(0.9)} className="mt-8 max-w-md text-base text-primary/70 lg:text-lg">
              An Islamic school where faith and excellence grow together. We raise
              confident, God-conscious young people ready to lead in this life and the next.
            </motion.p>

            <motion.div {...rise(1.05)} className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/admissions">
                    Join Our Legacy
                    <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-primary/30 bg-transparent px-7 text-primary hover:bg-muted"
                >
                  <Link href="/about">Our Mission</Link>
                </Button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* Image */}
          <div className="relative min-h-0">
            <motion.div
              style={reduceMotion ? undefined : { y: imageY }}
              className="absolute inset-x-3 bottom-3 top-0 lg:bottom-4 lg:left-0 lg:right-4 lg:top-[88px]"
            >
              <ImageReveal
                trigger="mount"
                delay={0.35}
                parallax={0}
                className="h-full w-full rounded-[2rem] shadow-2xl lg:rounded-[2.5rem]"
              >
                {HERO_IMAGE_SRC ? (
                  <Image
                    src={HERO_IMAGE_SRC}
                    alt="Students at Green Garden Schools"
                    fill
                    preload
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    icon={Building2}
                    label="Hero image"
                    tone="deep"
                    className="h-full w-full"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
              </ImageReveal>

              {/* Rotating seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: easeOutExpo }}
                style={reduceMotion ? undefined : { rotate: badgeRotate }}
                className="absolute -top-6 right-6 hidden size-28 sm:block lg:-left-14 lg:right-auto lg:top-1/4"
              >
                <div className="relative size-full rounded-full bg-secondary shadow-xl">
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 size-full text-primary"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <defs>
                      <path id="hero-seal" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                    </defs>
                    <text className="fill-current text-[7.4px] font-bold tracking-[0.14em]">
                      <textPath href="#hero-seal">{BADGE_TEXT}</textPath>
                    </text>
                  </motion.svg>
                  <Sparkles className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
              </motion.div>

              {/* Floating stat card, on a faster parallax layer */}
              <motion.div
                style={reduceMotion ? undefined : { y: cardY }}
                className="absolute bottom-8 left-4 lg:-left-10 lg:bottom-16"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, x: -30 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 1, delay: 1.3, ease: easeOutExpo }}
                  className="w-64 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["bg-primary", "bg-accent", "bg-secondary", "bg-[#1c7d51]"].map(
                        (bg, i) => (
                          <span
                            key={i}
                            className={`size-8 rounded-full border-2 border-white ${bg}`}
                          />
                        )
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">2.5k+ Students</p>
                      <p className="text-xs text-primary/60">Flourishing in our community</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          {...rise(1.4)}
          className={`absolute bottom-8 left-6 z-10 lg:left-0 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary/60 lg:flex ${GUTTER}`}
        >
          <span className="relative h-10 w-px overflow-hidden bg-primary/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-primary"
              animate={reduceMotion ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll to explore
        </motion.div>

        {/* Dims the hero as the next section covers it */}
        <motion.div
          aria-hidden
          style={{ opacity: reduceMotion ? 0 : dim }}
          className="pointer-events-none absolute inset-0 z-20 bg-primary"
        />
      </motion.div>
    </section>
  );
}
