"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Heart, Plus, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col">
      <div className="flex-1 px-4 pb-28 pt-6 sm:px-6">
        {children}
      </div>
      <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
        <div className="glass-nav flex items-center justify-around rounded-2xl px-2 py-2.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-all",
                  active
                    ? "scale-105"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    active ? "stroke-[2.5] text-[#F15BB5]" : "text-current",
                  )}
                />
                <span className={active ? "text-rainbow" : undefined}>{label}</span>
              </Link>
            );
          })}
          <ThemeToggle bare />
        </div>
      </nav>
    </div>
  );
}
