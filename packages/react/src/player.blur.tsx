import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type PlayerBlurStrength = "sm" | "md" | "lg";

export type PlayerBlurProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  strength?: PlayerBlurStrength;
};

const strengthClassName: Record<PlayerBlurStrength, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export function PlayerBlur({
  strength = "sm",
  className,
  ...props
}: PlayerBlurProps) {
  return (
    <div
      data-vp-blur=""
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] h-full w-full",
        strengthClassName[strength],
        className,
      )}
      {...props}
    />
  );
}
