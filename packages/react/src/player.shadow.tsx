import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type PlayerShadowEdge = "left" | "right" | "top" | "bottom";

export type PlayerShadowMinViewport = "xl" | "2xl";

export type PlayerShadowProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  edge: PlayerShadowEdge;
  /** Hide the shadow until this viewport breakpoint (`xl` = 80rem, `2xl` = 96rem). */
  minViewport?: PlayerShadowMinViewport;
};

/**
 * Inner: thin strap below `2xl`. Above `2xl`, excess viewport width (`100vw - 96rem`) is
 * split equally between left/right inner strips (each gets 1/4 of excess width).
 * Outer gradient: fixed 32rem (`w-[32rem]` / `h-[32rem]`).
 */
const innerWidthClassName =
  "shrink-0 bg-black w-[clamp(2px,calc(0.5rem*100vw/80rem),0.5rem)] 2xl:w-[calc(0.5rem+max(0px,(100vw-96rem)/4))]";

const outerWidthClassName = "shrink-0 w-[32rem]";

const innerHeightClassName =
  "shrink-0 bg-black h-[clamp(2px,calc(0.5rem*100vh/80rem),0.5rem)] 2xl:h-[calc(0.5rem+max(0px,(100vw-96rem)/4))]";

const outerHeightClassName = "shrink-0 h-[32rem]";

/** Cubic ease-out: opacity ≈ (1 − t)³ — faster drop near black, slower into transparent. */
const outerGradientClassName: Record<PlayerShadowEdge, string> = {
  left:
    "bg-[linear-gradient(to_right,#000_0%,rgba(0,0,0,0.86)_5%,rgba(0,0,0,0.68)_12%,rgba(0,0,0,0.47)_22%,rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.125)_50%,rgba(0,0,0,0.043)_65%,rgba(0,0,0,0.008)_80%,rgba(0,0,0,0.005)_92%,transparent_100%)]",
  right:
    "bg-[linear-gradient(to_left,#000_0%,rgba(0,0,0,0.86)_5%,rgba(0,0,0,0.68)_12%,rgba(0,0,0,0.47)_22%,rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.125)_50%,rgba(0,0,0,0.043)_65%,rgba(0,0,0,0.008)_80%,rgba(0,0,0,0.005)_92%,transparent_100%)]",
  top:
    "bg-[linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.86)_5%,rgba(0,0,0,0.68)_12%,rgba(0,0,0,0.47)_22%,rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.125)_50%,rgba(0,0,0,0.043)_65%,rgba(0,0,0,0.008)_80%,rgba(0,0,0,0.005)_92%,transparent_100%)]",
  bottom:
    "bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.86)_5%,rgba(0,0,0,0.68)_12%,rgba(0,0,0,0.47)_22%,rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.125)_50%,rgba(0,0,0,0.043)_65%,rgba(0,0,0,0.008)_80%,rgba(0,0,0,0.005)_92%,transparent_100%)]",
};

const edgeClassNames: Record<
  PlayerShadowEdge,
  { root: string; inner: string; outer: string }
> = {
  left: {
    root: "absolute inset-y-0 left-0 flex flex-row",
    inner: cn("h-full", innerWidthClassName),
    outer: cn("h-full", outerWidthClassName, outerGradientClassName.left),
  },
  right: {
    root: "absolute inset-y-0 right-0 flex flex-row-reverse",
    inner: cn("h-full", innerWidthClassName),
    outer: cn("h-full", outerWidthClassName, outerGradientClassName.right),
  },
  top: {
    root: "absolute inset-x-0 top-0 flex flex-col",
    inner: cn("w-full", innerHeightClassName),
    outer: cn("w-full", outerHeightClassName, outerGradientClassName.top),
  },
  bottom: {
    root: "absolute inset-x-0 bottom-0 flex flex-col-reverse",
    inner: cn("w-full", innerHeightClassName),
    outer: cn("w-full", outerHeightClassName, outerGradientClassName.bottom),
  },
};

const minViewportClassName: Record<PlayerShadowMinViewport, string> = {
  xl: "max-xl:hidden",
  "2xl": "max-2xl:hidden",
};

export function PlayerShadow({
  edge,
  minViewport,
  className,
  ...props
}: PlayerShadowProps) {
  const classes = edgeClassNames[edge];

  return (
    <div
      data-vp-shadow=""
      data-vp-shadow-edge={edge}
      aria-hidden
      className={cn(
        "pointer-events-none",
        classes.root,
        minViewport && minViewportClassName[minViewport],
        className,
      )}
      {...props}
    >
      <div data-vp-shadow-part="inner" className={classes.inner} />
      <div data-vp-shadow-part="outer" className={classes.outer} />
    </div>
  );
}
