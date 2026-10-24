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

export type PlayerShadowAxisMetrics = {
  innerThinRem: number;
  outerSizeRem: number;
  wideExcessShare: number;
  outerGradientEase: PlayerShadowGradientEase;
};

export const PLAYER_SHADOW_DEFAULTS: PlayerShadowAxisMetrics = {
  innerThinRem: 0.5,
  outerSizeRem: 32,
  wideExcessShare: 0.5,
  outerGradientEase: PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
};

export type { PlayerShadowGradientEase } from "./player.shadow-gradient";
export {
  PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
  buildPlayerShadowOuterGradient,
} from "./player.shadow-gradient";

type PlayerShadowContextValue = {
  horizontal: PlayerShadowAxisMetrics;
  vertical: PlayerShadowAxisMetrics;
};

const PlayerShadowContext = createContext<PlayerShadowContextValue | null>(null);

function isHorizontalEdge(edge: PlayerShadowEdge): boolean {
  return edge === "left" || edge === "right";
}

function usePlayerShadowAxisMetrics(
  component: string,
  edge: PlayerShadowEdge,
): PlayerShadowAxisMetrics {
  const value = useContext(PlayerShadowContext);
  if (!value) {
    throw new Error(
      `PlayerShadow.${component} must be used within PlayerShadow.Root`,
    );
  }
  return isHorizontalEdge(edge) ? value.horizontal : value.vertical;
}

type PlayerShadowAxisMetricsInput = {
  innerThinRem?: number;
  outerSizeRem?: number;
  wideExcessShare?: number;
  outerGradientEase?: PlayerShadowGradientEase;
};

function resolveAxisMetrics(
  axis: PlayerShadowAxisMetricsInput | undefined,
  flat: PlayerShadowAxisMetricsInput,
): PlayerShadowAxisMetrics {
  return {
    innerThinRem:
      axis?.innerThinRem ?? flat.innerThinRem ?? PLAYER_SHADOW_DEFAULTS.innerThinRem,
    outerSizeRem:
      axis?.outerSizeRem ?? flat.outerSizeRem ?? PLAYER_SHADOW_DEFAULTS.outerSizeRem,
    wideExcessShare:
      axis?.wideExcessShare ??
      flat.wideExcessShare ??
      PLAYER_SHADOW_DEFAULTS.wideExcessShare,
    outerGradientEase:
      axis?.outerGradientEase ??
      flat.outerGradientEase ??
      PLAYER_SHADOW_DEFAULTS.outerGradientEase,
  };
}

export type PlayerShadowRootProps = {
  children: ReactNode;
  horizontal?: PlayerShadowAxisMetricsInput;
  vertical?: PlayerShadowAxisMetricsInput;
  /** @deprecated Set `horizontal` / `vertical` instead; applies to both axes when used alone. */
  innerThinRem?: number;
  /** @deprecated Set `horizontal` / `vertical` instead; applies to both axes when used alone. */
  outerSizeRem?: number;
  /** @deprecated Set `horizontal` / `vertical` instead; applies to both axes when used alone. */
  wideExcessShare?: number;
  /** @deprecated Set `horizontal` / `vertical` instead; applies to both axes when used alone. */
  outerGradientEase?: PlayerShadowGradientEase;
};

function PlayerShadowRoot({
  children,
  horizontal,
  vertical,
  innerThinRem,
  outerSizeRem,
  wideExcessShare,
  outerGradientEase,
}: PlayerShadowRootProps) {
  const flat = useMemo(
    () => ({
      innerThinRem,
      outerSizeRem,
      wideExcessShare,
      outerGradientEase,
    }),
    [innerThinRem, outerSizeRem, wideExcessShare, outerGradientEase],
  );

  const value = useMemo(
    () => ({
      horizontal: resolveAxisMetrics(horizontal, flat),
      vertical: resolveAxisMetrics(vertical, flat),
    }),
    [horizontal, vertical, flat],
  );

  return (
    <PlayerShadowContext.Provider value={value}>
      {children}
    </PlayerShadowContext.Provider>
  );
}

const innerWidthClassName =
  "shrink-0 bg-black w-[clamp(2px,calc(var(--vp-shadow-inner-thin)*100vw/80rem),var(--vp-shadow-inner-thin))] 2xl:w-[calc(var(--vp-shadow-inner-thin)+max(0px,calc((100vw-96rem)*var(--vp-shadow-excess-share))))]";

const outerWidthClassName = "shrink-0 w-[var(--vp-shadow-outer)]";

const innerHeightClassName =
  "shrink-0 bg-black h-[clamp(2px,calc(var(--vp-shadow-inner-thin)*100vw/80rem),var(--vp-shadow-inner-thin))] 2xl:h-[calc(var(--vp-shadow-inner-thin)+max(0px,calc((100vw-96rem)*var(--vp-shadow-excess-share))))]";

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
}: PlayerShadowAxisMetrics): CSSProperties {
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
  const metrics = usePlayerShadowAxisMetrics(edge, edge);
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
