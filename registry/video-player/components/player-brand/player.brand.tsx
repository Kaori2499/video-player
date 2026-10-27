import { cn } from "@/lib/utils";
import { PlayIcon } from "@phosphor-icons/react";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

export const PLAYER_BRAND_DEFAULTS = {
  iconSizeRem: 1.25,
  separatorSizeRem: 1.6875,
  textSizeRem: 0.75,
  gapRem: 0.625,
} as const;

type PlayerBrandMetrics = {
  iconSizeRem: number;
  separatorSizeRem: number;
  textSizeRem: number;
};

const PlayerBrandContext = createContext<PlayerBrandMetrics | null>(null);

function usePlayerBrandMetrics(component: string): PlayerBrandMetrics {
  const metrics = useContext(PlayerBrandContext);
  if (!metrics) {
    throw new Error(
      `PlayerBrand.${component} must be used within PlayerBrand.Root`,
    );
  }
  return metrics;
}

export type PlayerBrandRootProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  iconSizeRem?: number;
  separatorSizeRem?: number;
  textSizeRem?: number;
  gapRem?: number;
};

function PlayerBrandRoot({
  children,
  iconSizeRem = PLAYER_BRAND_DEFAULTS.iconSizeRem,
  separatorSizeRem = PLAYER_BRAND_DEFAULTS.separatorSizeRem,
  textSizeRem = PLAYER_BRAND_DEFAULTS.textSizeRem,
  gapRem = PLAYER_BRAND_DEFAULTS.gapRem,
  className,
  style,
  ...props
}: PlayerBrandRootProps) {
  const metrics = useMemo(
    () => ({ iconSizeRem, separatorSizeRem, textSizeRem }),
    [iconSizeRem, separatorSizeRem, textSizeRem],
  );

  return (
    <PlayerBrandContext.Provider value={metrics}>
      <div
        data-vp-brand=""
        className={cn(
          "inline-flex max-w-full items-center text-foreground",
          className,
        )}
        style={{ gap: `${gapRem}rem`, ...style }}
        {...props}
      >
        {children}
      </div>
    </PlayerBrandContext.Provider>
  );
}

export type PlayerBrandIconProps = Omit<
  HTMLAttributes<SVGSVGElement>,
  "children"
>;

function PlayerBrandIcon({ className, style, ...props }: PlayerBrandIconProps) {
  const { iconSizeRem } = usePlayerBrandMetrics("Icon");

  return (
    <PlayIcon
      data-vp-brand-part="icon"
      weight="fill"
      aria-hidden
      className={cn("shrink-0", className)}
      style={{
        width: `${iconSizeRem}rem`,
        height: `${iconSizeRem}rem`,
        ...style,
      }}
      {...props}
    />
  );
}

export type PlayerBrandSeparatorProps = HTMLAttributes<HTMLDivElement>;

function PlayerBrandSeparator({
  className,
  style,
  ...props
}: PlayerBrandSeparatorProps) {
  const { separatorSizeRem } = usePlayerBrandMetrics("Separator");

  return (
    <div
      data-vp-brand-part="separator"
      role="separator"
      aria-orientation="vertical"
      className={cn("shrink-0 bg-current opacity-30", className)}
      style={{
        height: `${separatorSizeRem}rem`,
        width: "1px",
        ...style,
      }}
      {...props}
    />
  );
}

export type PlayerBrandLabelProps = HTMLAttributes<HTMLSpanElement>;

function PlayerBrandLabel({
  children,
  className,
  style,
  ...props
}: PlayerBrandLabelProps) {
  const { textSizeRem } = usePlayerBrandMetrics("Label");

  return (
    <span
      data-vp-brand-part="label"
      className={cn(
        "flex min-w-0 flex-col font-mono font-light uppercase",
        className,
      )}
      style={{
        fontSize: `${textSizeRem}rem`,
        lineHeight: 1.2,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export type PlayerBrandLabelLineProps = HTMLAttributes<HTMLSpanElement>;

function PlayerBrandLabelLine({
  children,
  className,
  ...props
}: PlayerBrandLabelLineProps) {
  return (
    <span
      data-vp-brand-part="label-line"
      className={cn("block truncate", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export const PlayerBrand = {
  Root: PlayerBrandRoot,
  Icon: PlayerBrandIcon,
  Separator: PlayerBrandSeparator,
  Label: PlayerBrandLabel,
  LabelLine: PlayerBrandLabelLine,
};
