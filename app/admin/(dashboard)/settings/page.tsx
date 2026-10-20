"use client";

import { useState } from "react";
import { Check, Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { AdminButton, PageHeader } from "@/components/admin/page-header";
import { FormError, FormSection, TextField } from "@/components/forms/fields";
import { useSiteSettings, useUpdateSettings } from "@/hooks/use-settings";
import type { SiteSettings } from "@/lib/types";

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const update = useUpdateSettings();
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);

  function set<K extends Exclude<keyof SiteSettings, "socials">>(key: K) {
    return (value: string) => {
      setSaved(false);
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  }

  function setSocial(key: keyof SiteSettings["socials"]) {
    return (value: string) => {
      setSaved(false);
      setForm((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    update.mutate(form, { onSuccess: () => setSaved(true) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
          <FormSection title="Phone & email">
            <TextField id="phonePrimary" label="Main phone" icon={Phone} value={form.phonePrimary} onChange={set("phonePrimary")} required />
            <TextField id="phoneSecondary" label="Second phone" icon={Phone} value={form.phoneSecondary} onChange={set("phoneSecondary")} />
            <TextField id="emailGeneral" type="email" label="General email" icon={Mail} value={form.emailGeneral} onChange={set("emailGeneral")} required />
            <TextField id="emailAdmissions" type="email" label="Admissions email" icon={Mail} value={form.emailAdmissions} onChange={set("emailAdmissions")} required />
          </FormSection>
        </section>

        <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
          <FormSection title="Address & hours">
            <TextField id="addressLine1" label="Street address" icon={MapPin} value={form.addressLine1} onChange={set("addressLine1")} required />
            <TextField id="addressLine2" label="Area, city, country" icon={MapPin} value={form.addressLine2} onChange={set("addressLine2")} />
            <TextField id="officeHours" label="Office hours" icon={Clock} value={form.officeHours} onChange={set("officeHours")} hint="e.g. Mon–Fri, 7:30–16:00" />
            <TextField id="mapUrl" type="url" label="Map link (Get directions)" icon={Globe} value={form.mapUrl} onChange={set("mapUrl")} hint="Paste a Google Maps link to your campus." />
          </FormSection>
        </section>
      </div>

      <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
        <FormSection title="Social media" description="Leave blank to hide an icon on the Contact page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="instagram" type="url" label="Instagram URL" value={form.socials.instagram} onChange={setSocial("instagram")} />
            <TextField id="facebook" type="url" label="Facebook URL" value={form.socials.facebook} onChange={setSocial("facebook")} />
            <TextField id="x" type="url" label="X (Twitter) URL" value={form.socials.x} onChange={setSocial("x")} />
            <TextField id="linkedin" type="url" label="LinkedIn URL" value={form.socials.linkedin} onChange={setSocial("linkedin")} />
          </div>
        </FormSection>
      </section>

      <FormError message={update.isError ? update.error.message : null} />

      <div className="flex items-center gap-4">
        <AdminButton type="submit" disabled={update.isPending}>
          <Check className="size-4" /> {update.isPending ? "Saving…" : "Save changes"}
        </AdminButton>
        {saved && <p className="text-sm font-medium text-[#1c7d51]">Saved. The website is updated.</p>}
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const { data, isPlaceholderData } = useSiteSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Details"
        description="Shown on the Contact page and in the website footer."
      />
      {data && !isPlaceholderData ? (
        <SettingsForm initial={data} />
      ) : (
        <p className="text-primary/50">Loading…</p>
      )}
    </div>
  );
}
