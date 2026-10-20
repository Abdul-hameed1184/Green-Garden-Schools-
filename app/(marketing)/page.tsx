import { Hero } from "@/components/home/hero";
import { CultureOfInquiry } from "@/components/home/culture-of-inquiry";
import { CuriousMinds } from "@/components/home/curious-minds";
import { Pillars } from "@/components/home/pillars";
import { CtaBand } from "@/components/home/cta-band";

export default function HomePage() {
  return (
    <>
      {/* Hero is sticky; every section after it is z-10 with a solid background so it slides over. */}
      <Hero />
      <CultureOfInquiry />
      <CuriousMinds />
      <Pillars />
      <CtaBand />
    </>
  );
}
