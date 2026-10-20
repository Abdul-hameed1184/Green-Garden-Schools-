import { cn } from "@/lib/utils";
import type { AlbumStatus } from "@/lib/types";

const styles: Record<AlbumStatus, string> = {
  Published: "bg-secondary text-primary",
  Review: "bg-amber-100 text-amber-700",
  Archived: "bg-muted text-primary/50",
};

export function StatusPill({ status }: { status: AlbumStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        styles[status]
      )}
    >
      {status === "Review" ? "Draft" : status}
    </span>
  );
}
