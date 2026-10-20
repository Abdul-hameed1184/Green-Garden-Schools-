"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import {
  ChoiceChips,
  FormError,
  FormSection,
  FormSuccess,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { useInquiryMutation } from "@/hooks/use-inquiry-mutation";

const gradeLevels = ["Crèche", "Nursery", "Primary", "Junior Secondary", "Senior Secondary", "Hifz Track"];

const empty = { firstName: "", lastName: "", email: "", phone: "", gradeLevel: "", message: "" };

export function InquiryForm() {
  const mutation = useInquiryMutation();
  const [form, setForm] = useState(empty);

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: () => setForm(empty) });
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <FormSuccess
            key="success"
            tone="dark"
            title="Inquiry Sent"
            message="Jazakallahu khairan. Our admissions team will be in touch within 48 hours."
            onReset={() => mutation.reset()}
          />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <FormSection tone="dark" title="Parent / Guardian">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="firstName"
                  label="First name"
                  tone="dark"
                  icon={User}
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={update("firstName")}
                  required
                />
                <TextField
                  id="lastName"
                  label="Last name"
                  tone="dark"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={update("lastName")}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="email"
                  type="email"
                  label="Email address"
                  tone="dark"
                  icon={Mail}
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                />
                <TextField
                  id="phone"
                  type="tel"
                  label="Phone number"
                  tone="dark"
                  icon={Phone}
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
            </FormSection>

            <FormSection tone="dark" title="Your child">
              <ChoiceChips
                name="gradeLevel"
                label="Applying for"
                tone="dark"
                options={gradeLevels}
                value={form.gradeLevel}
                onChange={update("gradeLevel")}
              />
              <TextAreaField
                id="inquiry-message"
                label="Anything we should know? (optional)"
                tone="dark"
                rows={4}
                value={form.message}
                onChange={update("message")}
              />
            </FormSection>

            <FormError message={mutation.isError ? mutation.error.message : null} />

            <SubmitButton tone="dark" pending={mutation.isPending}>
              Send Inquiry
            </SubmitButton>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
