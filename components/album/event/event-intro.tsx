"use client";

import { CalendarDays, Images, MapPin, Tag } from "lucide-react";
import { formatEventDate } from "@/components/album/album-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import type { AlbumItem } from "@/lib/types";

/** Story on the right; a pinned fact sheet (date, place, key numbers) on the left. */
export function EventIntro({ item }: { item: AlbumItem }) {
  const facts = [
    { icon: Tag, label: "Category", value: item.category },
    { icon: CalendarDays, label: "Date", value: formatEventDate(item.eventDate) },
    item.location ? { icon: MapPin, label: "Location", value: item.location } : null,
    { icon: Images, label: "Photos", value: String(item.photos.length) },
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return (
    <section className="bg-background py-28 lg:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-14 px-6 lg:grid-cols-[0.8fr_1.4fr] lg:gap-24 lg:px-10">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <RevealOnScroll direction="right" y={40}>
            <dl className="divide-y divide-primary/10 border-y border-primary/10">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 py-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-muted text-primary">
                    <Icon className="size-4" />
                  </span>
                  <dt className="w-24 text-sm text-primary/50">{label}</dt>
                  <dd className="font-semibold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>

          {item.highlights.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              {item.highlights.map((h, i) => (
                <RevealOnScroll key={`${h.label}-${i}`} delay={0.1 * i} scale>
                  <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                    <p className="font-display text-4xl text-secondary">{h.value}</p>
                    <p className="mt-1 text-sm text-primary-foreground/70">{h.label}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </aside>

        <div>
          <RevealOnScroll direction="right" y={40}>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              The Story
            </span>
          </RevealOnScroll>
          {item.description ? (
            <ScrollRevealText
              text={item.description}
              className="mt-8 text-3xl font-semibold leading-[1.25] tracking-tight text-primary sm:text-4xl lg:text-5xl"
            />
          ) : (
            <p className="mt-8 text-2xl text-primary/50">The story of this event is coming soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}
