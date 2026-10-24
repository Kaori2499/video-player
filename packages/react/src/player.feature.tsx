import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { PlayIcon } from "@phosphor-icons/react";
import {
  siApplepodcasts,
  siSpotify,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import { usePlayerContext } from "./player.context";
import { PlayerFeatureSimpleIcon } from "./player.feature.simple-icon";
import type { Player } from "./player.types";
import {
  createContext,
  type AnchorHTMLAttributes,
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { TimeHTMLAttributes } from "react";

export const PLAYER_FEATURE_DEFAULTS = {
  titleSizeRem: 3,
  descriptionSizeRem: 1,
  descriptionLineHeight: 1.6,
  linksSizeRem: 0.875,
  dateSizeRem: 0.8125,
  durationSizeRem: 0.875,
  playSizeRem: 1,
  socialButtonSizeRem: 2,
  socialIconSizeRem: 0.9375,
  gapRem: 1.75,
  descriptionMaxWidthRem: 20.5,
  socialButtonBg: "#6a6a6a40",
  socialButtonHoverBg: "#a6a6a640",
} as const;

type PlayerFeatureMetrics = {
  titleSizeRem: number;
  descriptionSizeRem: number;
  descriptionLineHeight: number;
  linksSizeRem: number;
  dateSizeRem: number;
  durationSizeRem: number;
  playSizeRem: number;
  socialButtonSizeRem: number;
  socialIconSizeRem: number;
  gapRem: number;
  descriptionMaxWidthRem: number;
  socialButtonBg: string;
  socialButtonHoverBg: string;
};

const PlayerFeatureContext = createContext<PlayerFeatureMetrics | null>(null);

const FEATURE_DURATION_COMPACT_RE = /^\d+s$|^\d+m$|^\d+h\d+m$/;

/** Compact feature duration, e.g. `16s`, `13m`, `1h12m`. */
export function formatFeatureDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "";
  }

  const total = Math.max(0, Math.round(seconds));

  if (total < 60) {
    return `${total}s`;
  }

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

function parseFeatureDurationLabel(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed || FEATURE_DURATION_COMPACT_RE.test(trimmed)) {
    return undefined;
  }

  const parts = trimmed.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) {
    return undefined;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return undefined;
}

function resolveFeatureDurationDisplay(
  seconds?: number,
  fallbackLabel?: string,
): string | undefined {
  if (seconds !== undefined) {
    const formatted = formatFeatureDuration(seconds);
    return formatted || undefined;
  }

  if (!fallbackLabel) {
    return undefined;
  }

  const parsed = parseFeatureDurationLabel(fallbackLabel);
  if (parsed !== undefined) {
    const formatted = formatFeatureDuration(parsed);
    return formatted || undefined;
  }

  return fallbackLabel;
}

function usePlayerFeatureMetrics(part: string): PlayerFeatureMetrics {
  const metrics = useContext(PlayerFeatureContext);
  if (!metrics) {
    throw new Error(
      `PlayerFeature.${part} must be used within PlayerFeature.Root`,
    );
  }
  return metrics;
}

export type PlayerFeatureRootProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  titleSizeRem?: number;
  descriptionSizeRem?: number;
  descriptionLineHeight?: number;
  linksSizeRem?: number;
  dateSizeRem?: number;
  durationSizeRem?: number;
  playSizeRem?: number;
  socialButtonSizeRem?: number;
  socialIconSizeRem?: number;
  gapRem?: number;
  descriptionMaxWidthRem?: number;
  socialButtonBg?: string;
  socialButtonHoverBg?: string;
};

function PlayerFeatureRoot({
  children,
  titleSizeRem = PLAYER_FEATURE_DEFAULTS.titleSizeRem,
  descriptionSizeRem = PLAYER_FEATURE_DEFAULTS.descriptionSizeRem,
  descriptionLineHeight = PLAYER_FEATURE_DEFAULTS.descriptionLineHeight,
  linksSizeRem = PLAYER_FEATURE_DEFAULTS.linksSizeRem,
  dateSizeRem = PLAYER_FEATURE_DEFAULTS.dateSizeRem,
  durationSizeRem = PLAYER_FEATURE_DEFAULTS.durationSizeRem,
  playSizeRem = PLAYER_FEATURE_DEFAULTS.playSizeRem,
  socialButtonSizeRem = PLAYER_FEATURE_DEFAULTS.socialButtonSizeRem,
  socialIconSizeRem = PLAYER_FEATURE_DEFAULTS.socialIconSizeRem,
  gapRem = PLAYER_FEATURE_DEFAULTS.gapRem,
  descriptionMaxWidthRem = PLAYER_FEATURE_DEFAULTS.descriptionMaxWidthRem,
  socialButtonBg = PLAYER_FEATURE_DEFAULTS.socialButtonBg,
  socialButtonHoverBg = PLAYER_FEATURE_DEFAULTS.socialButtonHoverBg,
  className,
  style,
  ...props
}: PlayerFeatureRootProps) {
  const metrics = useMemo(
    () => ({
      titleSizeRem,
      descriptionSizeRem,
      descriptionLineHeight,
      linksSizeRem,
      dateSizeRem,
      durationSizeRem,
      playSizeRem,
      socialButtonSizeRem,
      socialIconSizeRem,
      gapRem,
      descriptionMaxWidthRem,
      socialButtonBg,
      socialButtonHoverBg,
    }),
    [
      titleSizeRem,
      descriptionSizeRem,
      descriptionLineHeight,
      linksSizeRem,
      dateSizeRem,
      durationSizeRem,
      playSizeRem,
      socialButtonSizeRem,
      socialIconSizeRem,
      gapRem,
      descriptionMaxWidthRem,
      socialButtonBg,
      socialButtonHoverBg,
    ],
  );

  return (
    <PlayerFeatureContext.Provider value={metrics}>
      <div
        data-vp-feature=""
        className={cn(
          "flex w-full flex-col items-start text-left font-light",
          className,
        )}
        style={{
          gap: `${gapRem}rem`,
          ["--vp-feature-social-btn-bg" as string]: socialButtonBg,
          ["--vp-feature-social-btn-hover-bg" as string]: socialButtonHoverBg,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </PlayerFeatureContext.Provider>
  );
}

/** Groups title and description; `Root` `gapRem` spaces intro, play, and details row. */
export type PlayerFeatureIntroProps = HTMLAttributes<HTMLDivElement>;

function PlayerFeatureIntro({
  children,
  className,
  ...props
}: PlayerFeatureIntroProps) {
  return (
    <div
      data-vp-feature-part="intro"
      className={cn("flex w-full flex-col items-start gap-[0.375rem]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerFeatureTitleProps = HTMLAttributes<HTMLHeadingElement>;

function PlayerFeatureTitle({
  children,
  className,
  style,
  ...props
}: PlayerFeatureTitleProps) {
  const { titleSizeRem } = usePlayerFeatureMetrics("Title");

  return (
    <h2
      data-vp-feature-part="title"
      className={cn("font-normal text-balance tracking-tighter", className)}
      style={{
        fontSize: `${titleSizeRem}rem`,
        lineHeight: 1.2,
        ...style,
      }}
      {...props}
    >
      {children}
    </h2>
  );
}

export type PlayerFeatureDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function PlayerFeatureDescription({
  children,
  className,
  style,
  ...props
}: PlayerFeatureDescriptionProps) {
  const { descriptionSizeRem, descriptionLineHeight, descriptionMaxWidthRem } =
    usePlayerFeatureMetrics("Description");

  return (
    <p
      data-vp-feature-part="description"
      className={cn("max-w-full text-pretty opacity-75", className)}
      style={{
        fontSize: `${descriptionSizeRem}rem`,
        lineHeight: descriptionLineHeight,
        maxWidth: `${descriptionMaxWidthRem}rem`,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}

export type PlayerFeatureLinksProps = HTMLAttributes<HTMLUListElement>;

function PlayerFeatureLinks({
  children,
  className,
  ...props
}: PlayerFeatureLinksProps) {
  return (
    <ul
      data-vp-feature-part="links"
      className={cn(
        "flex list-none flex-wrap items-center justify-start gap-x-3 gap-y-1 p-0",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export type PlayerFeatureLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function PlayerFeatureLink({
  children,
  className,
  style,
  ...props
}: PlayerFeatureLinkProps) {
  const { linksSizeRem } = usePlayerFeatureMetrics("Link");

  return (
    <li>
      <a
        data-vp-feature-part="link"
        className={cn("underline decoration-current/30 underline-offset-2", className)}
        style={{
          fontSize: `${linksSizeRem}rem`,
          lineHeight: 1.3,
          ...style,
        }}
        {...props}
      >
        {children}
      </a>
    </li>
  );
}

export type PlayerFeaturePlayProps = ComponentProps<typeof Button>;

function PlayerFeaturePlay({
  children = "Play conversation",
  className,
  style,
  type = "button",
  variant = "ghost",
  size = "lg",
  ...props
}: PlayerFeaturePlayProps) {
  const { playSizeRem } = usePlayerFeatureMetrics("Play");
  const playIconSizeRem = playSizeRem * 1.15;

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      data-vp-feature-part="play"
      className={cn(
        "shrink-0 cursor-pointer rounded-full bg-vp-feature-play-bg text-vp-feature-play-fg hover:bg-vp-feature-play-bg-hover hover:text-vp-feature-play-fg",
        "[&_[data-slot=kbd]]:bg-black/10 [&_[data-slot=kbd]]:text-vp-feature-play-fg",
        className,
      )}
      style={{
        fontSize: `${playSizeRem}rem`,
        ...style,
      }}
      {...props}
    >
      <PlayIcon
        data-icon="inline-start"
        weight="fill"
        aria-hidden
        className="shrink-0"
        style={{
          width: `${playIconSizeRem}rem`,
          height: `${playIconSizeRem}rem`,
        }}
      />
      {children}
      <Kbd>P</Kbd>
    </Button>
  );
}

export type PlayerFeatureDateProps = TimeHTMLAttributes<HTMLTimeElement>;

function PlayerFeatureDate({
  children,
  className,
  style,
  ...props
}: PlayerFeatureDateProps) {
  const { dateSizeRem } = usePlayerFeatureMetrics("Date");

  return (
    <time
      data-vp-feature-part="date"
      className={cn("font-sans text-foreground", className)}
      style={{
        fontSize: `${dateSizeRem}rem`,
        lineHeight: 1.3,
        ...style,
      }}
      {...props}
    >
      {children}
    </time>
  );
}

export type PlayerFeatureDurationProps = HTMLAttributes<HTMLSpanElement> & {
  /** When set, shown as compact duration (`16s`, `13m`, `1h12m`). */
  seconds?: number;
};

function PlayerFeatureDuration({
  children,
  seconds,
  className,
  style,
  ...props
}: PlayerFeatureDurationProps) {
  const { durationSizeRem } = usePlayerFeatureMetrics("Duration");
  const display =
    resolveFeatureDurationDisplay(
      seconds,
      typeof children === "string" ? children : undefined,
    ) ?? children;

  return (
    <span
      data-vp-feature-part="duration"
      className={cn("font-sans text-foreground", className)}
      style={{
        fontSize: `${durationSizeRem}rem`,
        lineHeight: 1.3,
        ...style,
      }}
      {...props}
    >
      {display}
    </span>
  );
}

export type PlayerFeatureMetaProps = HTMLAttributes<HTMLDivElement>;

function PlayerFeatureMeta({
  children,
  className,
  ...props
}: PlayerFeatureMetaProps) {
  return (
    <div
      data-vp-feature-part="meta"
      className={cn("flex flex-wrap items-center justify-start gap-x-2 gap-y-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerFeatureDetailsRowProps = HTMLAttributes<HTMLDivElement>;

function PlayerFeatureDetailsRow({
  children,
  className,
  ...props
}: PlayerFeatureDetailsRowProps) {
  return (
    <div
      data-vp-feature-part="details-row"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 font-sans",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerFeatureFollowLabelProps = HTMLAttributes<HTMLSpanElement>;

function PlayerFeatureFollowLabel({
  children = "Follow",
  className,
  style,
  ...props
}: PlayerFeatureFollowLabelProps) {
  const { dateSizeRem } = usePlayerFeatureMetrics("FollowLabel");

  return (
    <span
      data-vp-feature-part="follow-label"
      className={cn("font-sans opacity-75", className)}
      style={{
        fontSize: `${dateSizeRem}rem`,
        lineHeight: 1.3,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export type PlayerFeatureDotProps = HTMLAttributes<HTMLSpanElement>;

function PlayerFeatureDot({ className, ...props }: PlayerFeatureDotProps) {
  return (
    <span
      aria-hidden
      data-vp-feature-part="dot"
      className={cn("opacity-40", className)}
      {...props}
    >
      ·
    </span>
  );
}

export type PlayerFeatureSocialButtonProps = ComponentProps<typeof Button>;

const playerFeatureSocialButtonClassName =
  "font-sans shrink-0 cursor-pointer overflow-hidden rounded-full bg-[var(--vp-feature-social-btn-bg)] p-0 hover:bg-[var(--vp-feature-social-btn-hover-bg)] hover:text-inherit dark:hover:bg-[var(--vp-feature-social-btn-hover-bg)]";

function PlayerFeatureSocialButton({
  icon,
  part,
  "aria-label": ariaLabel,
  className,
  style,
  ...props
}: PlayerFeatureSocialButtonProps & {
  icon: SimpleIcon;
  part: string;
  "aria-label": string;
}) {
  const { socialButtonSizeRem, socialIconSizeRem } =
    usePlayerFeatureMetrics("Social");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-vp-feature-part={part}
      aria-label={ariaLabel}
      className={cn(playerFeatureSocialButtonClassName, className)}
      style={{
        width: `${socialButtonSizeRem}rem`,
        height: `${socialButtonSizeRem}rem`,
        minWidth: `${socialButtonSizeRem}rem`,
        minHeight: `${socialButtonSizeRem}rem`,
        ...style,
      }}
      {...props}
    >
      <PlayerFeatureSimpleIcon icon={icon} sizeRem={socialIconSizeRem} />
    </Button>
  );
}

function PlayerFeatureSocialYoutube({
  "aria-label": ariaLabel = siYoutube.title,
  ...props
}: PlayerFeatureSocialButtonProps) {
  return (
    <PlayerFeatureSocialButton
      icon={siYoutube}
      part="social-youtube"
      aria-label={ariaLabel}
      {...props}
    />
  );
}

function PlayerFeatureSocialSpotify({
  "aria-label": ariaLabel = siSpotify.title,
  ...props
}: PlayerFeatureSocialButtonProps) {
  return (
    <PlayerFeatureSocialButton
      icon={siSpotify}
      part="social-spotify"
      aria-label={ariaLabel}
      {...props}
    />
  );
}

function PlayerFeatureSocialApplePodcasts({
  "aria-label": ariaLabel = siApplepodcasts.title,
  ...props
}: PlayerFeatureSocialButtonProps) {
  return (
    <PlayerFeatureSocialButton
      icon={siApplepodcasts}
      part="social-apple-podcasts"
      aria-label={ariaLabel}
      {...props}
    />
  );
}

export type PlayerFeatureFromActiveVideoProps = {
  duration?: string;
  durationSeconds?: number;
};

function PlayerFeatureFromActiveVideo({
  duration,
  durationSeconds,
}: PlayerFeatureFromActiveVideoProps) {
  const { state } = usePlayerContext();
  const metadata = state.activeVideo?.metadata;

  if (!metadata) {
    return null;
  }

  const formattedDuration = resolveFeatureDurationDisplay(
    durationSeconds ?? metadata.durationSeconds,
    metadata.durationLabel ?? duration,
  );

  return (
    <>
      {metadata.title || metadata.description ? (
        <PlayerFeatureIntro>
          {metadata.title ? (
            <PlayerFeatureTitle>{metadata.title}</PlayerFeatureTitle>
          ) : null}
          {metadata.description ? (
            <PlayerFeatureDescription>
              {metadata.description}
            </PlayerFeatureDescription>
          ) : null}
        </PlayerFeatureIntro>
      ) : null}
      <PlayerFeaturePlay />
      {metadata.links && metadata.links.length > 0 ? (
        <PlayerFeatureLinks>
          {metadata.links.map((link: Player.VideoLink) => (
            <PlayerFeatureLink
              key={`${link.href}-${link.label}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </PlayerFeatureLink>
          ))}
        </PlayerFeatureLinks>
      ) : null}
      {metadata.date ? (
        <PlayerFeatureDate dateTime={metadata.date}>
          {metadata.date}
        </PlayerFeatureDate>
      ) : null}
      {formattedDuration ? (
        <PlayerFeatureDuration>{formattedDuration}</PlayerFeatureDuration>
      ) : null}
    </>
  );
}

export const PlayerFeature = {
  Root: PlayerFeatureRoot,
  Intro: PlayerFeatureIntro,
  Title: PlayerFeatureTitle,
  Description: PlayerFeatureDescription,
  Links: PlayerFeatureLinks,
  Link: PlayerFeatureLink,
  Date: PlayerFeatureDate,
  Duration: PlayerFeatureDuration,
  Meta: PlayerFeatureMeta,
  DetailsRow: PlayerFeatureDetailsRow,
  FollowLabel: PlayerFeatureFollowLabel,
  Dot: PlayerFeatureDot,
  Social: {
    Youtube: PlayerFeatureSocialYoutube,
    Spotify: PlayerFeatureSocialSpotify,
    ApplePodcasts: PlayerFeatureSocialApplePodcasts,
  },
  Play: PlayerFeaturePlay,
  FromActiveVideo: PlayerFeatureFromActiveVideo,
};
