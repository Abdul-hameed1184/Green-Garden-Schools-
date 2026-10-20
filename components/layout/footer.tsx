"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Wordmark } from "@/components/layout/navbar";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { useSiteSettings } from "@/hooks/use-settings";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/admissions", label: "Admissions" },
  { href: "/album", label: "The Album" },
  { href: "/contact", label: "Contact" },
];

const admissionsLinks = [
  { href: "/admissions#requirements", label: "Requirements" },
  { href: "/admissions#process", label: "How to Apply" },
  { href: "/admissions#inquiry", label: "Send an Inquiry" },
];

const linkClass =
  "inline-block transition-transform duration-300 hover:translate-x-1 hover:text-white";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const wordOpacity = useTransform(scrollYProgress, [0.2, 1], [0, 1]);
  const { data: settings } = useSiteSettings();

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <RevealOnScroll className="space-y-3">
          <span className="text-2xl">
            <Wordmark className="text-white" />
          </span>
          <p className="max-w-xs text-sm text-primary-foreground/70">
            An Islamic school in Lagos, nurturing faith, excellence and character since 2008.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="space-y-3 text-sm">
          <h3 className="font-semibold uppercase tracking-wide text-secondary">Quick Links</h3>
          <ul className="space-y-2 text-primary-foreground/80">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="space-y-3 text-sm">
          <h3 className="font-semibold uppercase tracking-wide text-secondary">Admissions</h3>
          <ul className="space-y-2 text-primary-foreground/80">
            {admissionsLinks.map((link, index) => (
              <li key={`${link.label}-${index}`}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3} className="space-y-3 text-sm">
          <h3 className="font-semibold uppercase tracking-wide text-secondary">Contact</h3>
          {settings && (
            <>
              <p className="text-primary-foreground/80">
                {settings.addressLine1}
                {settings.addressLine2 && (
                  <>
                    <br />
                    {settings.addressLine2}
                  </>
                )}
              </p>
              <a href={`tel:${settings.phonePrimary.replace(/\s/g, "")}`} className={`${linkClass} text-primary-foreground/80`}>
                {settings.phonePrimary}
              </a>
              <br />
              <a href={`mailto:${settings.emailAdmissions}`} className={`${linkClass} break-all text-primary-foreground/80`}>
                {settings.emailAdmissions}
              </a>
            </>
          )}
        </RevealOnScroll>
      </div>

      <div aria-hidden className="overflow-hidden px-4 select-none">
        <motion.p
          style={reduceMotion ? undefined : { y: wordY, opacity: wordOpacity }}
          className="whitespace-nowrap text-center font-display text-[9.5vw] uppercase italic leading-[0.85] tracking-tight text-secondary/90"
        >
          Green Garden<span className="text-white">.</span>
        </motion.p>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Green Garden Schools. All rights reserved.
      </div>
    </footer>
  );
}
