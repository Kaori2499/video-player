import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type PlayerBlurStrength = "sm" | "md" | "lg";

const blurShellClassName =
  "pointer-events-none absolute inset-0 z-[2] h-full w-full";

export type PlayerBlurSurfaceProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

function PlayerBlurSm({ className, ...props }: PlayerBlurSurfaceProps) {
  return (
    <div
      data-vp-blur=""
      data-vp-blur-strength="sm"
      aria-hidden
      className={cn(blurShellClassName, "backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function PlayerBlurMd({ className, ...props }: PlayerBlurSurfaceProps) {
  return (
    <div
      data-vp-blur=""
      data-vp-blur-strength="md"
      aria-hidden
      className={cn(blurShellClassName, "backdrop-blur-md", className)}
      {...props}
    />
  );
}

function PlayerBlurLg({ className, ...props }: PlayerBlurSurfaceProps) {
  return (
    <div
      data-vp-blur=""
      data-vp-blur-strength="lg"
      aria-hidden
      className={cn(blurShellClassName, "backdrop-blur-lg", className)}
      {...props}
    />
  );
}

export const PlayerBlur = {
  Sm: PlayerBlurSm,
  Md: PlayerBlurMd,
  Lg: PlayerBlurLg,
};
