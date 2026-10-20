import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  href?: string;
  highlight?: boolean;
}

export function StatCard({ label, value, hint, icon: Icon, href, highlight }: StatCardProps) {
  const body = (
    <div
      className={`h-full rounded-3xl p-6 transition-shadow ${
        highlight
          ? "bg-primary text-primary-foreground"
          : "border border-primary/10 bg-white text-primary shadow-sm"
      } ${href ? "hover:shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${highlight ? "text-primary-foreground/70" : "text-primary/60"}`}>
          {label}
        </p>
        {Icon && <Icon className={`size-5 ${highlight ? "text-secondary" : "text-primary/40"}`} />}
      </div>
      <p className="mt-3 font-display text-4xl">{value}</p>
      {hint && (
        <p className={`mt-1 text-sm ${highlight ? "text-primary-foreground/60" : "text-primary/50"}`}>{hint}</p>
      )}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
