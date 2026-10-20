import type { Metadata } from "next";
import { StoryHero } from "@/components/about/story-hero";
import { PrincipalWelcome } from "@/components/about/principal-welcome";
import { FoundationCards } from "@/components/about/foundation-cards";
import { JourneyTimeline } from "@/components/about/journey-timeline";
import { CtaBand } from "@/components/home/cta-band";
import { SlideOver } from "@/components/shared/slide-over";

export const metadata: Metadata = {
  title: "About Us | Green Garden Schools",
};

export default function AboutPage() {
  return (
    <>
      <StoryHero />
      <SlideOver>
        <PrincipalWelcome />
        <FoundationCards />
        <JourneyTimeline />
        <CtaBand />
      </SlideOver>
    </>
  );
}
