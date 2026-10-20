"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { easeOutExpo } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/admissions", label: "Admissions" },
  { href: "/album", label: "Album" },
  { href: "/contact", label: "Contact" },
];

const NAV_HEIGHT = "h-[72px]";

/** Routes whose full-screen hero is dark, so the transparent navbar needs light text. */
function hasDarkHero(pathname: string) {
  return pathname === "/about" || pathname.startsWith("/album/");
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display italic tracking-tight", className)}>
      GREEN GARDEN
      <span className="text-secondary">.</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > previous && latest > 160 && !open);
  });

  // Every marketing page opens on a full-bleed hero, so the bar starts transparent.
  const solid = scrolled || open;
  const light = !solid && hasDarkHero(pathname);

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          solid
            ? "border-b border-border/10 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
          light && "text-white"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10",
            NAV_HEIGHT
          )}
        >
          <Link
            href="/"
            className={cn("text-xl transition-colors duration-500", light ? "text-white" : "text-primary")}
            onClick={() => setOpen(false)}
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wide md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative py-1 transition-colors duration-500",
                  light
                    ? "text-white/70 hover:text-white"
                    : "text-primary/70 hover:text-primary",
                  pathname === link.href && (light ? "text-white" : "text-primary")
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100",
                    pathname === link.href && "scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/admin/login"
              className={cn(
                "text-sm font-semibold transition-colors duration-500 hover:underline",
                light ? "text-white" : "text-primary"
              )}
            >
              Admin Login
            </Link>
            <Magnetic>
              <Button
                asChild
                className={cn(
                  "rounded-full px-5 transition-colors duration-500",
                  light
                    ? "bg-secondary text-primary hover:bg-secondary/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Link href="/admissions">Apply Now</Link>
              </Button>
            </Magnetic>
          </div>

          <button
            type="button"
            className={cn("md:hidden", light ? "text-white" : "text-primary")}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="overflow-hidden border-t border-border/10 md:hidden"
            >
              <div className="flex flex-col gap-4 px-6 py-6 text-sm font-medium uppercase tracking-wide">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4, ease: easeOutExpo }}
                  >
                    <Link href={link.href} onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Link href="/admin/login" onClick={() => setOpen(false)}>
                  Admin Login
                </Link>
                <Button asChild className="rounded-full bg-primary text-primary-foreground">
                  <Link href="/admissions" onClick={() => setOpen(false)}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
