import type { Metadata } from "next";
import { AlbumHero } from "@/components/album/album-hero";
import { AlbumBrowser } from "@/components/album/album-browser";
import { KineticWordmark } from "@/components/album/kinetic-wordmark";
import { SlideOver } from "@/components/shared/slide-over";

export const metadata: Metadata = {
  title: "The Album | Green Garden Schools",
};

export default function AlbumPage() {
  return (
    <>
      <AlbumHero />
      <SlideOver>
        <AlbumBrowser />
        <KineticWordmark />
      </SlideOver>
    </>
  );
}
