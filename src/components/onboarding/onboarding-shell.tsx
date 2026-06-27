import { GatherLogo } from "@/components/brand/gather-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  title?: string;
  onSkip?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function OnboardingShell({
  step,
  totalSteps,
  title,
  onSkip,
  children,
  className,
}: OnboardingShellProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 glass-nav border-b-0">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-6 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <GatherLogo size={32} showWordmark wordmarkClassName="text-lg" />
            {title && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="truncate text-sm text-muted-foreground">{title}</span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="glass-pill px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip
              </button>
            )}
          </div>
        </div>
        <div className="progress-track mx-6 mb-3 h-1 overflow-hidden rounded-full">
          <div
            className="progress-rainbow h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className={cn("mx-auto w-full max-w-lg flex-1 px-6 py-8", className)}>
        {children}
      </main>
    </div>
  );
}
