import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-white/50 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-primary/50">
        <Icon className="size-6" />
      </span>
      <h2 className="font-display text-xl uppercase text-primary">{title}</h2>
      <p className="max-w-sm text-sm text-primary/60">{description}</p>
      <span className="mt-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary/50">
        Coming Soon
      </span>
    </div>
  );
}
