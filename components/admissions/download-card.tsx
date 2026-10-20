import { ArrowDownToLine } from "lucide-react";

interface DownloadCardProps {
  title: string;
  size: string;
  href: string;
}

export function DownloadCard({ title, size, href }: DownloadCardProps) {
  return (
    <a
      href={href}
      download
      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/15 px-5 py-4 text-white"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-secondary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />
      <span className="relative transition-colors duration-500 group-hover:text-primary">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs opacity-60">PDF • {size}</span>
      </span>
      <span className="relative flex size-9 items-center justify-center rounded-full bg-secondary text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-secondary">
        <ArrowDownToLine className="size-4" />
      </span>
    </a>
  );
}
