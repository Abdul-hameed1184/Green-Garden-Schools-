"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Lock, User } from "lucide-react";
import { Wordmark } from "@/components/layout/navbar";
import { FormError, SubmitButton, TextField } from "@/components/forms/fields";
import { easeOutExpo } from "@/components/motion/easing";
import { useLogin } from "@/hooks/use-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [keyphrase, setKeyphrase] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ username, keyphrase }, { onSuccess: () => router.push("/admin") });
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-primary text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-[#1c7d51]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[30rem] rounded-full bg-secondary/10 blur-3xl" />

      <header className="relative flex items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl">
          <Wordmark className="text-white" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to site
        </Link>
      </header>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="w-full max-w-lg"
        >
          <div className="text-center">
            <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Lock className="size-7" />
            </span>
            <h1 className="font-display text-4xl uppercase">Admin Sign In</h1>
            <p className="mt-3 text-white/60">Manage the album, inbox, FAQs and contact details.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl sm:p-10"
          >
            <TextField
              id="username"
              label="Username"
              tone="dark"
              icon={User}
              autoComplete="username"
              value={username}
              onChange={setUsername}
              required
            />
            <TextField
              id="keyphrase"
              type="password"
              label="Keyphrase"
              tone="dark"
              icon={KeyRound}
              autoComplete="current-password"
              value={keyphrase}
              onChange={setKeyphrase}
              required
            />
            <FormError message={login.isError ? login.error.message : null} />
            <SubmitButton tone="dark" pending={login.isPending} pendingLabel="Verifying…">
              Sign In
            </SubmitButton>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
