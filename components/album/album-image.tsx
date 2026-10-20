import { Building2, MoonStar, Music4, Palette, Trophy } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { AlbumCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const categoryIcon = {
  Faith: MoonStar,
  Campus: Building2,
  Academics: Palette,
  Sports: Trophy,
  Arts: Music4,
} as const;

interface AlbumImageProps {
  src: string | null;
  alt: string;
  category: AlbumCategory;
  className?: string;
  tone?: "deep" | "lemon" | "muted";
}

/**
 * Renders an admin-supplied image (any URL or data URL) filling its parent,
 * or a branded placeholder when there is none yet.
 */
export function AlbumImage({ src, alt, category, className, tone = "deep" }: AlbumImageProps) {
  if (!src) {
    return (
      <ImagePlaceholder
        icon={categoryIcon[category]}
        tone={tone}
        className={cn("h-full w-full", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin content may be data URLs or any host
    <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />
  );
}

export function formatEventDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
