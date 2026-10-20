"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  LogOut,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";
import { useAdmissionsInquiries, useContactMessages } from "@/hooks/use-inquiries";

export const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/album", label: "Album", icon: ImageIcon },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox, badge: "inbox" as const },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Contact Details", icon: Phone },
];

/** Count of unhandled-and-unread inbox entries, shown as a badge. */
export function useNewInboxCount() {
  const { data: inquiries } = useAdmissionsInquiries();
  const { data: messages } = useContactMessages();
  return [...(inquiries ?? []), ...(messages ?? [])].filter((e) => e.status === "new").length;
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const newCount = useNewInboxCount();

  function handleSignOut() {
    logout.mutate(undefined, { onSuccess: () => router.push("/admin/login") });
  }

  return (
    <div className="flex h-full flex-col justify-between bg-sidebar text-sidebar-foreground">
      <div>
        <div className="px-6 pb-6 pt-7">
          <p className="font-display text-lg italic tracking-tight text-white">
            GREEN GARDEN<span className="text-secondary">.</span>
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/50">
            Admin
          </p>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-xl px-4 text-[15px] font-medium transition-colors",
                  isActive
                    ? "bg-white text-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                <item.icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && newCount > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold",
                      isActive ? "bg-primary text-secondary" : "bg-secondary text-primary"
                    )}
                  >
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex h-12 items-center gap-3 rounded-xl px-4 text-[15px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
        >
          <ExternalLink className="size-5" /> View website
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-12 w-full items-center gap-3 rounded-xl px-4 text-[15px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
        >
          <LogOut className="size-5" /> Sign out
        </button>
      </div>
    </div>
  );
}
