"use client";

import type { ChangeEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, ChevronDown, Loader2, type LucideIcon } from "lucide-react";
import { easeOutExpo } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

/**
 * Form kit used by every form on the site (public and admin).
 * Large boxed fields with a floating label that sits inside the box.
 */

export type FieldTone = "light" | "dark";

const box = {
  light:
    "border-primary/15 bg-white text-primary hover:border-primary/35 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
  dark:
    "border-white/15 bg-white/[0.06] text-white hover:border-white/30 focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/15",
} as const;

const labelTone = {
  light: "text-primary/55 peer-focus:text-primary",
  dark: "text-white/55 peer-focus:text-secondary",
} as const;

const iconTone = {
  light: "text-primary/40 group-focus-within:text-primary",
  dark: "text-white/40 group-focus-within:text-secondary",
} as const;

interface BaseFieldProps {
  id: string;
  label: string;
  tone?: FieldTone;
  required?: boolean;
  hint?: string;
  error?: string | null;
  className?: string;
}

function FieldShell({
  tone = "light",
  error,
  hint,
  className,
  children,
}: Pick<BaseFieldProps, "tone" | "error" | "hint" | "className"> & { children: ReactNode }) {
  return (
    <div className={className}>
      <div
        className={cn(
          "group relative rounded-2xl border transition-[border-color,box-shadow,background-color] duration-300",
          box[tone],
          error && "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/15"
        )}
      >
        {children}
      </div>
      {(error || hint) && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1.5 px-1 text-sm",
            error ? "text-red-500" : tone === "dark" ? "text-white/50" : "text-primary/50"
          )}
        >
          {error && <AlertCircle className="size-4 shrink-0" />}
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function FloatingLabel({
  htmlFor,
  label,
  required,
  tone = "light",
  withIcon,
  multiline,
  alwaysFloat,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  tone?: FieldTone;
  withIcon?: boolean;
  multiline?: boolean;
  alwaysFloat?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "pointer-events-none absolute top-3 text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        withIcon ? "left-14" : "left-5",
        !alwaysFloat &&
          (multiline
            ? "peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal"
            : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal"),
        "peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium",
        labelTone[tone]
      )}
    >
      {label}
      {required && <span className="text-red-400"> *</span>}
    </label>
  );
}

interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  icon?: LucideIcon;
  /** Keep the label floated (needed for date/time inputs that always show a format). */
  alwaysFloat?: boolean;
  maxLength?: number;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  inputMode,
  icon: Icon,
  alwaysFloat,
  maxLength,
  tone = "light",
  hint,
  error,
  className,
}: TextFieldProps) {
  return (
    <FieldShell tone={tone} hint={hint} error={error} className={className}>
      {Icon && (
        <Icon
          className={cn(
            "pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 transition-colors",
            iconTone[tone]
          )}
        />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder=" "
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          "peer h-16 w-full rounded-2xl bg-transparent pb-2 pr-5 pt-6 text-[17px] outline-none",
          Icon ? "pl-14" : "pl-5",
          tone === "dark" && "[color-scheme:dark]"
        )}
      />
      <FloatingLabel
        htmlFor={id}
        label={label}
        required={required}
        tone={tone}
        withIcon={Boolean(Icon)}
        alwaysFloat={alwaysFloat}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  required,
  rows = 5,
  maxLength,
  tone = "light",
  hint,
  error,
  className,
}: TextAreaFieldProps) {
  return (
    <FieldShell tone={tone} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        maxLength={maxLength}
        placeholder=" "
        aria-invalid={Boolean(error) || undefined}
        className="peer block min-h-40 w-full resize-y rounded-2xl bg-transparent px-5 pb-4 pt-8 text-[17px] leading-relaxed outline-none"
      />
      <FloatingLabel htmlFor={id} label={label} required={required} tone={tone} multiline />
    </FieldShell>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required,
  tone = "light",
  hint,
  error,
  className,
}: SelectFieldProps) {
  return (
    <FieldShell tone={tone} hint={hint} error={error} className={className}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "peer h-16 w-full cursor-pointer appearance-none rounded-2xl bg-transparent pb-2 pl-5 pr-12 pt-6 text-[17px] outline-none",
          tone === "dark" && "[&>option]:text-primary"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FloatingLabel htmlFor={id} label={label} required={required} tone={tone} alwaysFloat />
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 transition-transform group-focus-within:rotate-180",
          iconTone[tone]
        )}
      />
    </FieldShell>
  );
}

interface ChoiceChipsProps {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  tone?: FieldTone;
}

/** Single-select pill group with a sliding active indicator. */
export function ChoiceChips({ name, label, options, value, onChange, tone = "light" }: ChoiceChipsProps) {
  const dark = tone === "dark";

  return (
    <fieldset>
      <legend className={cn("px-1 text-sm font-medium", dark ? "text-white/70" : "text-primary/70")}>
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = value === option;
          return (
            <label
              key={option}
              className={cn(
                "relative flex h-12 cursor-pointer select-none items-center rounded-full border px-5 text-[15px] font-medium transition-colors duration-300",
                "has-[:focus-visible]:ring-4",
                dark
                  ? "has-[:focus-visible]:ring-secondary/30"
                  : "has-[:focus-visible]:ring-primary/15",
                active
                  ? dark
                    ? "border-secondary text-primary"
                    : "border-primary text-primary-foreground"
                  : dark
                    ? "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/40"
                    : "border-primary/15 bg-white text-primary/80 hover:border-primary/40"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={active}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {active && (
                <motion.span
                  layoutId={`chip-${name}`}
                  className={cn("absolute inset-0 rounded-full", dark ? "bg-secondary" : "bg-primary")}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SubmitButtonProps {
  pending: boolean;
  children: ReactNode;
  pendingLabel?: string;
  tone?: FieldTone;
  className?: string;
}

/** Full-width pill with a fill sweep on hover and a looping arrow. */
export function SubmitButton({
  pending,
  children,
  pendingLabel = "Sending…",
  tone = "light",
  className,
}: SubmitButtonProps) {
  const dark = tone === "dark";
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-full pl-8 pr-2 text-[17px] font-semibold transition-colors disabled:opacity-70",
        dark ? "bg-secondary text-primary" : "bg-primary text-primary-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100",
          dark ? "bg-white" : "bg-[#1c7d51]"
        )}
      />
      <span className="relative">{pending ? pendingLabel : children}</span>
      <span
        className={cn(
          "relative flex size-12 items-center justify-center overflow-hidden rounded-full",
          dark ? "bg-primary text-secondary" : "bg-secondary text-primary"
        )}
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-10" />
            <ArrowRight className="absolute size-5 -translate-x-10 transition-transform duration-500 group-hover:translate-x-0" />
          </>
        )}
      </span>
    </button>
  );
}

export function FormError({ message }: { message?: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
        >
          <AlertCircle className="size-4 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

interface FormSuccessProps {
  title: string;
  message: string;
  onReset: () => void;
  tone?: FieldTone;
}

/** Animated success state: a drawn check mark and a staggered message. */
export function FormSuccess({ title, message, onReset, tone = "light" }: FormSuccessProps) {
  const dark = tone === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="flex min-h-[28rem] flex-col items-center justify-center gap-4 text-center"
    >
      <svg viewBox="0 0 52 52" className={cn("size-20", dark ? "text-secondary" : "text-primary")}>
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        />
        <motion.path
          d="M15 27l7 7 15-15"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: easeOutExpo }}
        />
      </svg>
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: easeOutExpo }}
        className="font-display text-3xl uppercase"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: easeOutExpo }}
        className={cn("max-w-sm text-[17px]", dark ? "text-white/70" : "text-primary/70")}
      >
        {message}
      </motion.p>
      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className={cn(
          "mt-2 h-12 rounded-full border px-7 text-[15px] font-semibold transition-colors",
          dark ? "border-white/30 hover:bg-white/10" : "border-primary/30 hover:bg-muted"
        )}
      >
        Send another
      </motion.button>
    </motion.div>
  );
}

/** Small uppercase heading used to group fields inside long forms. */
export function FormSection({
  title,
  description,
  children,
  tone = "light",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  tone?: FieldTone;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h4
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "dark" ? "text-secondary" : "text-primary/60"
          )}
        >
          {title}
        </h4>
        {description && (
          <p className={cn("mt-1 text-sm", tone === "dark" ? "text-white/50" : "text-primary/50")}>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
