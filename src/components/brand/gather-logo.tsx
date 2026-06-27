import Image from "next/image";
import { cn } from "@/lib/utils";

interface GatherLogoProps {
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
  priority?: boolean;
}

export function GatherLogo({
  size = 44,
  showWordmark = false,
  wordmarkClassName,
  className,
  priority = false,
}: GatherLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/Logo.png"
        alt="Gather"
        width={size}
        height={size}
        className="object-contain"
        priority={priority}
      />
      {showWordmark && (
        <span className={cn("font-heading text-xl text-rainbow", wordmarkClassName)}>
          Gather
        </span>
      )}
    </div>
  );
}
