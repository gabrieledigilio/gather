import { cn } from "@/lib/utils";

interface GatherLogoProps {
  className?: string;
  wordmarkClassName?: string;
}

export function GatherLogo({ className, wordmarkClassName }: GatherLogoProps) {
  return (
    <span className={cn("font-heading text-xl text-rainbow", wordmarkClassName, className)}>
      Gather
    </span>
  );
}
