"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import {
  ChoiceChips,
  FormError,
  FormSuccess,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { useContactMutation } from "@/hooks/use-contact-mutation";

const subjects = ["Admissions", "Campus Tour", "Hifz Programme", "Alumni", "Careers", "Something else"];

const empty = { fullName: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const mutation = useContactMutation();
  const [form, setForm] = useState(empty);

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: () => setForm(empty) });
  }

  return (
    <RevealOnScroll direction="left" y={60} delay={0.1}>
      <div className="rounded-[2rem] bg-muted p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {mutation.isSuccess ? (
            <FormSuccess
              key="success"
              title="Message Sent"
              message="Jazakallahu khairan for reaching out. We'll respond as soon as possible."
              onReset={() => mutation.reset()}
            />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-display text-3xl uppercase text-primary">Send a Message</h3>
                <p className="mt-2 text-primary/60">We usually reply within one working day.</p>
              </div>

              <ChoiceChips
                name="subject"
                label="What's it about?"
                options={subjects}
                value={form.subject}
                onChange={update("subject")}
              />

              <TextField
                id="fullName"
                label="Full name"
                icon={User}
                autoComplete="name"
                value={form.fullName}
                onChange={update("fullName")}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="contact-email"
                  type="email"
                  label="Email"
                  icon={Mail}
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                />
                <TextField
                  id="contact-phone"
                  type="tel"
                  label="Phone (optional)"
                  icon={Phone}
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
              <TextAreaField
                id="message"
                label="How can we help?"
                value={form.message}
                onChange={update("message")}
                required
              />

              <FormError message={mutation.isError ? mutation.error.message : null} />

              <SubmitButton pending={mutation.isPending}>Send Message</SubmitButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </RevealOnScroll>
  );
}
