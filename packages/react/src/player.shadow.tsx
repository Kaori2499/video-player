import { cn } from "@/lib/utils";
import {
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  buildPlayerShadowOuterGradient,
  PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
  type PlayerShadowGradientEase,
} from "./player.shadow-gradient";

export type PlayerShadowEdge = "left" | "right" | "top" | "bottom";

export type PlayerShadowMinViewport = "xl" | "2xl";

export const PLAYER_SHADOW_DEFAULTS = {
  innerThinRem: 0.5,
  outerSizeRem: 32,
  wideExcessShare: 0.5,
  outerGradientEase: PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
} as const;

export type { PlayerShadowGradientEase } from "./player.shadow-gradient";
export {
  PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
  buildPlayerShadowOuterGradient,
} from "./player.shadow-gradient";

type PlayerShadowMetrics = {
  innerThinRem: number;
  outerSizeRem: number;
  wideExcessShare: number;
  outerGradientEase: PlayerShadowGradientEase;
};

const PlayerShadowContext = createContext<PlayerShadowMetrics | null>(null);

function usePlayerShadowMetrics(component: string): PlayerShadowMetrics {
  const metrics = useContext(PlayerShadowContext);
  if (!metrics) {
    throw new Error(
      `PlayerShadow.${component} must be used within PlayerShadow.Root`,
    );
  }
  return metrics;
}

export type PlayerShadowRootProps = {
  children: ReactNode;
  innerThinRem?: number;
  outerSizeRem?: number;
  wideExcessShare?: number;
  outerGradientEase?: PlayerShadowGradientEase;
};

function PlayerShadowRoot({
  children,
  innerThinRem = PLAYER_SHADOW_DEFAULTS.innerThinRem,
  outerSizeRem = PLAYER_SHADOW_DEFAULTS.outerSizeRem,
  wideExcessShare = PLAYER_SHADOW_DEFAULTS.wideExcessShare,
  outerGradientEase = PLAYER_SHADOW_DEFAULTS.outerGradientEase,
}: PlayerShadowRootProps) {
  const metrics = useMemo(
    () => ({
      innerThinRem,
      outerSizeRem,
      wideExcessShare,
      outerGradientEase,
    }),
    [innerThinRem, outerSizeRem, wideExcessShare, outerGradientEase],
  );

  return (
    <PlayerShadowContext.Provider value={metrics}>
      {children}
    </PlayerShadowContext.Provider>
  );
}

const innerWidthClassName =
  "shrink-0 bg-black w-[clamp(2px,calc(var(--vp-shadow-inner-thin)*100vw/80rem),var(--vp-shadow-inner-thin))] 2xl:w-[calc(var(--vp-shadow-inner-thin)+max(0px,calc((100vw-96rem)*var(--vp-shadow-excess-share))))]";

const outerWidthClassName = "shrink-0 w-[var(--vp-shadow-outer)]";

const innerHeightClassName =
  "shrink-0 bg-black h-[clamp(2px,calc(var(--vp-shadow-inner-thin)*100vh/80rem),var(--vp-shadow-inner-thin))] 2xl:h-[calc(var(--vp-shadow-inner-thin)+max(0px,calc((100vw-96rem)*var(--vp-shadow-excess-share))))]";

const outerHeightClassName = "shrink-0 h-[var(--vp-shadow-outer)]";

const edgeClassNames: Record<
  PlayerShadowEdge,
  { root: string; inner: string; outer: string }
> = {
  left: {
    root: "absolute inset-y-0 left-0 flex flex-row",
    inner: cn("h-full", innerWidthClassName),
    outer: cn("h-full", outerWidthClassName),
  },
  right: {
    root: "absolute inset-y-0 right-0 flex flex-row-reverse",
    inner: cn("h-full", innerWidthClassName),
    outer: cn("h-full", outerWidthClassName),
  },
  top: {
    root: "absolute inset-x-0 top-0 flex flex-col",
    inner: cn("w-full", innerHeightClassName),
    outer: cn("w-full", outerHeightClassName),
  },
  bottom: {
    root: "absolute inset-x-0 bottom-0 flex flex-col-reverse",
    inner: cn("w-full", innerHeightClassName),
    outer: cn("w-full", outerHeightClassName),
  },
};

const minViewportClassName: Record<PlayerShadowMinViewport, string> = {
  xl: "max-xl:hidden",
  "2xl": "max-2xl:hidden",
};

function shadowStyleVars({
  innerThinRem,
  outerSizeRem,
  wideExcessShare,
}: PlayerShadowMetrics): CSSProperties {
  return {
    "--vp-shadow-inner-thin": `${innerThinRem}rem`,
    "--vp-shadow-outer": `${outerSizeRem}rem`,
    "--vp-shadow-excess-share": String(wideExcessShare),
  } as CSSProperties;
}

export type PlayerShadowEdgeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  minViewport?: PlayerShadowMinViewport;
};

function PlayerShadowEdge({
  edge,
  minViewport,
  className,
  style,
  ...props
}: PlayerShadowEdgeProps & { edge: PlayerShadowEdge }) {
  const metrics = usePlayerShadowMetrics(edge);
  const classes = edgeClassNames[edge];
  const outerBackgroundImage = buildPlayerShadowOuterGradient(
    edge,
    metrics.outerGradientEase,
  );

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
      style={{
        ...shadowStyleVars(metrics),
        ...style,
      }}
      {...props}
    >
      <div data-vp-shadow-part="inner" className={classes.inner} />
      <div
        data-vp-shadow-part="outer"
        className={classes.outer}
        style={{ backgroundImage: outerBackgroundImage }}
      />
    </div>
  );
}

function PlayerShadowLeft(props: PlayerShadowEdgeProps) {
  return <PlayerShadowEdge edge="left" {...props} />;
}

function PlayerShadowRight(props: PlayerShadowEdgeProps) {
  return <PlayerShadowEdge edge="right" {...props} />;
}

function PlayerShadowTop(props: PlayerShadowEdgeProps) {
  return <PlayerShadowEdge edge="top" {...props} />;
}

function PlayerShadowBottom(props: PlayerShadowEdgeProps) {
  return <PlayerShadowEdge edge="bottom" {...props} />;
}

export const PlayerShadow = {
  Root: PlayerShadowRoot,
  Left: PlayerShadowLeft,
  Right: PlayerShadowRight,
  Top: PlayerShadowTop,
  Bottom: PlayerShadowBottom,
};
