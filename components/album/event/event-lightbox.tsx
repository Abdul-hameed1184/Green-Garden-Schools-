"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AlbumImage } from "@/components/album/album-image";
import { easeOutExpo } from "@/components/motion/easing";
import type { AlbumItem } from "@/lib/types";

interface EventLightboxProps {
  item: AlbumItem;
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Fullscreen photo viewer: arrow keys, swipe/drag, Esc to close. */
export function EventLightbox({ item, index, onIndexChange, onClose }: EventLightboxProps) {
  const lenis = useLenis();
  const open = index !== null;
  const total = item.photos.length;
  const photo = index !== null ? item.photos[index] : null;

  // Freeze page scroll while open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [open, lenis]);

  useEffect(() => {
    if (index === null) return;
    const current = index;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((current + 1) % total);
      if (e.key === "ArrowLeft") onIndexChange((current - 1 + total) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onClose, onIndexChange]);

  function step(delta: number) {
    if (index === null) return;
    onIndexChange((index + delta + total) % total);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -80) step(1);
    else if (info.offset.x > 80) step(-1);
  }

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-lenis-prevent
          className="fixed inset-0 z-[70] flex flex-col bg-[#07190e]/95 text-white backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-6 py-5 lg:px-10">
            <p className="font-mono text-sm tabular-nums text-white/70">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <p className="hidden truncate px-6 font-display uppercase sm:block">{item.title}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-primary"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 lg:px-24">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
              >
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin content may be data URLs or any host
                  <img
                    src={photo.src}
                    alt={photo.caption || item.title}
                    draggable={false}
                    className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl">
                    <AlbumImage src={null} alt="" category={item.category} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-primary sm:flex lg:left-8"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-primary sm:flex lg:right-8"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          <div className="px-6 py-6 text-center lg:px-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="min-h-6 text-white/80"
              >
                {photo.caption}
              </motion.p>
            </AnimatePresence>
            {total > 1 && (
              <div className="mx-auto mt-4 flex max-w-full justify-start gap-2 overflow-x-auto pb-1 sm:justify-center [scrollbar-width:none]">
                {item.photos.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    aria-label={`Go to photo ${i + 1}`}
                    aria-current={i === index}
                    className={`relative size-14 shrink-0 overflow-hidden rounded-xl transition-all duration-300 sm:size-16 ${
                      i === index ? "ring-2 ring-secondary ring-offset-2 ring-offset-[#07190e]" : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <AlbumImage src={p.src} alt="" category={item.category} tone={i % 2 ? "lemon" : "deep"} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
