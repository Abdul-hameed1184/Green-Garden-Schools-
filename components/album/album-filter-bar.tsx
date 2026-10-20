"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ALBUM_CATEGORIES } from "@/lib/types";

const categories = ["All", ...ALBUM_CATEGORIES];

interface AlbumFilterBarProps {
  active: string;
  onChange: (category: string) => void;
}

export function AlbumFilterBar({ active, onChange }: AlbumFilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter events by category"
      className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-primary/10 bg-muted p-1.5 [scrollbar-width:none]"
    >
      {categories.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300",
              isActive ? "text-primary-foreground" : "text-primary/70 hover:text-primary"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="album-filter-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-lg"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
