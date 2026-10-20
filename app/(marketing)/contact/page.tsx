import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfoList } from "@/components/contact/contact-info-list";
import { ContactFaq } from "@/components/contact/contact-faq";
import { MapPlaceholder } from "@/components/contact/map-placeholder";
import { SlideOver } from "@/components/shared/slide-over";

export const metadata: Metadata = {
  title: "Contact | Green Garden Schools",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <SlideOver>
        <section className="bg-background py-28 lg:py-36">
          <div className="mx-auto grid grid-cols-1 max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-10">
            <ContactInfoList />
            <ContactForm />
          </div>
        </section>
        <MapPlaceholder />
        <ContactFaq />
      </SlideOver>
    </>
  );
}
