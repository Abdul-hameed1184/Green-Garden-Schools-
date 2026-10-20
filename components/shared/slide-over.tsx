import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps everything after a sticky PageHero so it slides up over the hero like a
 * card. Uses overflow-clip (not hidden) so sticky children keep working.
 */
export function SlideOver({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative z-10 overflow-clip rounded-t-[2.5rem] bg-background shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.35)] lg:rounded-t-[4rem]",
        className
      )}
    >
      {children}
    </div>
  );
}
