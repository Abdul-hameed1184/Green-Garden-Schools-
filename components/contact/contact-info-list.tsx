"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitText } from "@/components/motion/split-text";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/shared/social-icons";
import { useSiteSettings } from "@/hooks/use-settings";
import type { SiteSettings } from "@/lib/types";

const socialIcons = {
  instagram: { icon: InstagramIcon, label: "Instagram" },
  facebook: { icon: FacebookIcon, label: "Facebook" },
  x: { icon: TwitterIcon, label: "X (Twitter)" },
  linkedin: { icon: LinkedInIcon, label: "LinkedIn" },
} as const;

function contactRows(s: SiteSettings) {
  return [
    {
      icon: Phone,
      label: "Call Us",
      value: s.phonePrimary,
      secondary: s.phoneSecondary,
      href: `tel:${(s.phoneSecondary || s.phonePrimary).replace(/\s/g, "")}`,
      copy: s.phoneSecondary || s.phonePrimary,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: s.emailGeneral,
      secondary: s.emailAdmissions,
      href: `mailto:${s.emailGeneral}`,
      copy: s.emailGeneral,
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: s.addressLine1,
      secondary: s.addressLine2,
      href: s.mapUrl || "#",
      copy: [s.addressLine1, s.addressLine2].filter(Boolean).join(", "),
    },
  ];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context); the link still works.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${text}`}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/15 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function ContactInfoList() {
  const { data: settings } = useSiteSettings();
  if (!settings) return null;
  const items = contactRows(settings);
  const socials = (Object.keys(socialIcons) as (keyof typeof socialIcons)[])
    .filter((key) => settings.socials[key])
    .map((key) => ({ ...socialIcons[key], href: settings.socials[key] }));

  return (
    <div>
      <RevealOnScroll direction="right" y={40}>
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Reach Us Directly
        </span>
      </RevealOnScroll>
      <SplitText
        as="h2"
        text={"Connect\nWith Us."}
        by="char"
        className="mt-6 font-display text-5xl uppercase leading-[0.9] text-primary sm:text-6xl"
        lineClassName={(i) => (i === 1 ? "text-accent" : undefined)}
      />

      <ul className="mt-12 border-t border-primary/10">
        {items.map((item, i) => (
          <RevealOnScroll key={item.label} delay={0.1 * i} direction="right" y={40}>
            <li className="group relative flex items-center gap-5 overflow-hidden border-b border-primary/10 py-6">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-muted transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <item.icon className="size-5" />
              </span>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="relative min-w-0 flex-1"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-primary/50">
                  {item.label}
                </span>
                <span className="mt-1 flex items-center gap-2 truncate text-lg font-semibold text-primary lg:text-xl">
                  {item.value}
                  <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                </span>
                <span className="block truncate text-sm text-primary/60">{item.secondary}</span>
              </a>
              <span className="relative">
                <CopyButton text={item.copy} />
              </span>
            </li>
          </RevealOnScroll>
        ))}
      </ul>

      {socials.length > 0 && (
        <RevealOnScroll delay={0.3} className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50">
            Follow Our Journey
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <Magnetic key={label} strength={0.5}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-full border border-primary/15 text-primary transition-colors duration-300 hover:bg-primary hover:text-secondary"
                >
                  <Icon className="size-4" />
                </a>
              </Magnetic>
            ))}
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
}
