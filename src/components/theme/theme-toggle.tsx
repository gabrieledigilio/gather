"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  bare?: boolean;
}

export function ThemeToggle({
  className,
  showLabel = false,
  bare = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    if (bare) {
      return (
        <div
          className={cn("size-5", className)}
          aria-hidden
        />
      );
    }

    return (
      <div
        className={cn(
          "glass-pill flex items-center gap-2 px-3 py-1.5",
          showLabel ? "w-full justify-between" : "size-9 justify-center",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (bare) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] text-muted-foreground transition-all hover:text-foreground",
          className,
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "glass-pill flex items-center gap-2",
        showLabel ? "w-full justify-between px-4 py-3" : "px-2.5 py-1.5",
        className
      )}
    >
      {showLabel && (
        <div className="flex items-center gap-3">
          {isDark ? (
            <Moon className="size-4 text-rainbow" />
          ) : (
            <Sun className="size-4 text-rainbow" />
          )}
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-muted-foreground">
              {isDark ? "Easier on the eyes at night" : "Bright glass look"}
            </p>
          </div>
        </div>
      )}

      {!showLabel && (
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/20 dark:hover:bg-white/10"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      )}

      {showLabel && (
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle dark mode"
        />
      )}
    </div>
  );
}
