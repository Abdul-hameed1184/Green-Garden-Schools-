import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  icon?: LucideIcon;
  label?: string;
  className?: string;
  tone?: "deep" | "lemon" | "muted";
}

const tones = {
  deep: "from-primary/90 via-primary/70 to-[#5d6f2a]/70 text-secondary",
  lemon: "from-secondary via-secondary/80 to-accent/40 text-primary",
  muted: "from-muted via-muted to-white text-primary/40",
};

export function ImagePlaceholder({
  icon: Icon = ImageIcon,
  label,
  className,
  tone = "deep",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br",
        tones[tone],
        className
      )}
    >
      <Icon className="size-10 opacity-70" strokeWidth={1.5} />
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          {label}
        </span>
      )}
    </div>
  );
}
