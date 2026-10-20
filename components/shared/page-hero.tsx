"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SplitText } from "@/components/motion/split-text";
import { useHeroScrollOut } from "@/components/motion/use-hero-scroll-out";
import { easeOutExpo } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

/** Left gutter that lines hero copy up with the max-w-7xl navbar content. */
export const HERO_GUTTER = "lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]";

export const heroRise = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: easeOutExpo },
});

interface PageHeroProps {
  eyebrow: string;
  /** Use "\n" for line breaks. */
  title: string;
  description?: ReactNode;
  tone?: "light" | "dark";
  layout?: "split" | "center";
  /** Line index rendered as outline type. */
  outlineLine?: number;
  /** Line index rendered in the accent colour. */
  accentLine?: number;
  /** Image slot for the split layout. Pass `src: null` to show a placeholder. */
  image?: { src: string | null; alt: string; label?: string; icon?: LucideIcon };
  /** Replaces the image slot entirely (split layout). */
  aside?: ReactNode;
  /** Extra content under the description (CTAs, download cards…). */
  children?: ReactNode;
  /** Decorative layer rendered behind everything (receives the scroll progress). */
  background?: ReactNode;
}

/**
 * Full-screen, pinned page hero. Content staggers in on load; while scrolling the
 * hero scales down and dims as the next section slides over it.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  tone = "light",
  layout = "split",
  outlineLine,
  accentLine,
  image,
  aside,
  children,
  background,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();
  const { scale, radius, textY, textOpacity, imageY, dim } = useHeroScrollOut();
  const dark = tone === "dark";
  const centered = layout === "center";
  const Icon = image?.icon ?? ImageIcon;

  return (
    <section className="sticky top-0 z-0 h-svh overflow-hidden bg-primary">
      <motion.div
        style={reduceMotion ? undefined : { scale, borderRadius: radius }}
        className={cn(
          "relative h-full origin-top overflow-hidden",
          dark ? "bg-primary text-primary-foreground" : "bg-background text-primary"
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className={cn(
              "absolute -left-40 top-1/4 size-[36rem] rounded-full blur-3xl",
              dark ? "bg-[#1c7d51]/40" : "bg-secondary/40"
            )}
            animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className={cn(
              "absolute inset-0 bg-[size:8rem_100%]",
              dark
                ? "bg-[linear-gradient(to_right,rgba(217,249,157,0.06)_1px,transparent_1px)]"
                : "bg-[linear-gradient(to_right,rgba(20,83,45,0.05)_1px,transparent_1px)]"
            )}
          />
          {background}
        </div>

        <div
          className={cn(
            "relative grid h-full",
            centered
              ? "place-items-center"
              : "grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[1.15fr_1fr] lg:grid-rows-1"
          )}
        >
          <motion.div
            style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
            className={cn(
              "relative z-10 flex flex-col justify-center px-6",
              centered
                ? "items-center text-center"
                : cn("pb-6 pt-28 lg:pb-0 lg:pr-12 lg:pt-0", HERO_GUTTER)
            )}
          >
            <motion.span
              {...heroRise(0.1)}
              className={cn(
                "mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur",
                dark
                  ? "border-secondary/30 bg-white/5 text-secondary"
                  : "border-primary/20 bg-muted/80 text-primary"
              )}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              {eyebrow}
            </motion.span>

            <SplitText
              as="h1"
              text={title}
              by="char"
              trigger="mount"
              delay={0.25}
              className={cn(
                "font-display uppercase",
                centered
                  ? "text-[clamp(2.75rem,11vw,9rem)]"
                  : "text-[clamp(2rem,8.8vw,4.5rem)] lg:text-[min(5.2vw,5.25rem)]",
                // After the size classes: tailwind-merge drops leading-* set before a text size.
                "leading-[0.88]"
              )}
              lineClassName={(i) =>
                i === outlineLine
                  ? dark
                    ? "text-transparent [-webkit-text-stroke:2px_var(--secondary)]"
                    : "text-transparent [-webkit-text-stroke:2px_var(--primary)]"
                  : i === accentLine
                    ? dark
                      ? "text-secondary"
                      : "text-accent"
                    : undefined
              }
            />

            {description && (
              <motion.div
                {...heroRise(0.9)}
                className={cn(
                  "mt-8 max-w-md text-base lg:text-lg",
                  dark ? "text-primary-foreground/75" : "text-primary/70",
                  centered && "mx-auto max-w-xl"
                )}
              >
                {description}
              </motion.div>
            )}

            {children && (
              <motion.div {...heroRise(1.05)} className="mt-8 w-full">
                {children}
              </motion.div>
            )}
          </motion.div>

          {!centered && (
            <div className="relative min-h-0">
              <motion.div
                style={reduceMotion ? undefined : { y: imageY }}
                className="absolute inset-x-3 bottom-3 top-0 lg:bottom-4 lg:left-0 lg:right-4 lg:top-[88px]"
              >
                {aside ?? (
                  <ImageReveal
                    trigger="mount"
                    delay={0.35}
                    parallax={0}
                    className="h-full w-full rounded-[2rem] shadow-2xl lg:rounded-[2.5rem]"
                  >
                    {image?.src ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        preload
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder
                        icon={Icon}
                        label={image?.label}
                        tone={dark ? "lemon" : "deep"}
                        className="h-full w-full"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
                  </ImageReveal>
                )}
              </motion.div>
            </div>
          )}
        </div>

        <motion.div
          {...heroRise(1.4)}
          className={cn(
            "absolute bottom-8 z-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] lg:flex",
            dark ? "text-primary-foreground/60" : "text-primary/60",
            centered ? "left-1/2 -translate-x-1/2" : cn("left-0", HERO_GUTTER)
          )}
        >
          <span className={cn("relative h-10 w-px overflow-hidden", dark ? "bg-white/15" : "bg-primary/15")}>
            <motion.span
              className={cn("absolute inset-x-0 top-0 h-1/2", dark ? "bg-secondary" : "bg-primary")}
              animate={reduceMotion ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll
        </motion.div>

        <motion.div
          aria-hidden
          style={{ opacity: reduceMotion ? 0 : dim }}
          className="pointer-events-none absolute inset-0 z-20 bg-primary"
        />
      </motion.div>
    </section>
  );
}
