import type { Metadata } from "next";
import { AdmissionsHero } from "@/components/admissions/admissions-hero";
import { AdmissionsProcess } from "@/components/admissions/admissions-process";
import { AdmissionRequirements } from "@/components/admissions/admission-requirements";
import { InquirySection } from "@/components/admissions/inquiry-section";
import { SlideOver } from "@/components/shared/slide-over";

export const metadata: Metadata = {
  title: "Admissions | Green Garden Schools",
};

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHero />
      <SlideOver>
        <AdmissionsProcess />
        <AdmissionRequirements />
        <InquirySection />
      </SlideOver>
    </>
  );
}
