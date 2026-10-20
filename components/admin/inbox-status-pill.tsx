import { cn } from "@/lib/utils";
import type { InboxStatus } from "@/lib/types";

const styles: Record<InboxStatus, string> = {
  new: "bg-secondary text-primary",
  read: "bg-sky-100 text-sky-700",
  handled: "bg-muted text-primary/50",
};

const labels: Record<InboxStatus, string> = { new: "New", read: "Read", handled: "Handled" };

export function InboxStatusPill({ status }: { status: InboxStatus }) {
  return (
    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
}
