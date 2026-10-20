"use client";

import Link from "next/link";
import { ArrowDown, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { PageHero } from "@/components/shared/page-hero";

/** Swap for a real photo, e.g. "/images/admissions-hero.jpg". */
const ADMISSIONS_HERO_IMAGE: string | null = null;

export function AdmissionsHero() {
  return (
    <PageHero
      eyebrow="Admissions Open 2025/26"
      title={"Join Our\nLegacy."}
      outlineLine={1}
      description="We seek curious minds and ambitious hearts. Begin your journey toward academic and personal excellence today."
      image={{
        src: ADMISSIONS_HERO_IMAGE,
        alt: "Students arriving at Green Garden Schools",
        label: "Admissions",
        icon: GraduationCap,
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Magnetic>
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
          >
            <Link href="#inquiry">
              Start an Inquiry
              <ArrowDown className="transition-transform duration-500 group-hover:translate-y-0.5" />
            </Link>
          </Button>
        </Magnetic>
        <a
          href="/documents/prospectus-2024.pdf"
          download
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <FileText className="size-4" />
          <span className="relative">
            Download Prospectus
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-500 group-hover:scale-x-0 group-hover:origin-right" />
          </span>
        </a>
      </div>
    </PageHero>
  );
}
