import { cn } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PlayerBlur } from "./player.blur";
import { PlayerBrand } from "./player.brand";
import { PlayerCarousel } from "./player.carousel";
import { formatFeatureDuration, PlayerFeature } from "./player.feature";
import { PlayerLayout } from "./player.layout";
import { PlayerPreview } from "./player.preview";
import { PlayerShadow } from "./player.shadow";
import type { Player } from "./player.types";

/** Page-enter stagger. Carousel waits until this row. */
const ENTER_ROW = {
  brand: 0,
  title: 1,
  description: 2,
  play: 3,
  details: 4,
  carousel: 5,
} as const;

const ENTER_ROW_COUNT = 6;

const PAGE_ENTER = {
  staggerMs: 80,
  durationMs: 500,
  maxBlurPx: 8,
  translateYRem: 0.5,
} as const;

const FEATURE_CROSSFADE = {
  enabled: true,
  exitDurationMs: 240,
  enterDurationMs: 320,
  maxBlurPx: 8,
} as const;

const CAROUSEL_SLIDE_ENTER = {
  staggerMs: 40,
  durationMs: 500,
  maxBlurPx: 8,
  translateYRem: 0.5,
  baseDelayMs: ENTER_ROW.carousel * PAGE_ENTER.staggerMs,
} as const;

const SHADOW_HORIZONTAL = {
  innerThinRem: 0.125,
  outerSizeRem: 71,
  wideExcessShare: 0.25,
  outerGradientEase: [0, 0, 0.51, 0.91],
} as const;

const SHADOW_VERTICAL = {
  innerThinRem: 0.125,
  outerSizeRem: 17,
  wideExcessShare: 0,
  outerGradientEase: [0, 0, 0.58, 1],
} as const;

const ENTER_EASE = "cubic-bezier(0, 0, 0.58, 1)";

const featureAlignClassName = "max-sm:items-end sm:items-center";

const featureRootClassName =
  "max-sm:[&_[data-vp-feature-part=title]]:!text-[1.5rem] max-sm:[&_[data-vp-feature-part=description]]:!max-w-none";

const playClassName = cn(
  "[&_[data-slot=kbd]]:max-sm:hidden",
  "max-sm:h-8 max-sm:min-h-8 max-sm:px-3.5 max-sm:!text-[0.875rem]",
  "[&_svg]:max-sm:!size-3.5",
);

type PlayRegistrar = (handler: (() => void) | undefined) => void;

const VideoPlayerBlockPlayRegistrarContext = createContext<PlayRegistrar | null>(
  null,
);

type VideoPlayerBlockEnterContextValue = {
  enterDone: boolean;
};

const VideoPlayerBlockEnterContext =
  createContext<VideoPlayerBlockEnterContextValue | null>(null);

function pageEnterTotalDurationMs() {
  return (
    (ENTER_ROW_COUNT - 1) * PAGE_ENTER.staggerMs + PAGE_ENTER.durationMs
  );
}

function VideoPlayerBlockEnterProvider({ children }: { children: ReactNode }) {
  const [enterDone, setEnterDone] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setEnterDone(true),
      pageEnterTotalDurationMs(),
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <VideoPlayerBlockEnterContext.Provider value={{ enterDone }}>
      {children}
    </VideoPlayerBlockEnterContext.Provider>
  );
}

export type VideoPlayerBlockProps = {
  videos: Player.Video[];
  defaultActiveIndex?: number;
  /** Called from the play control and the P shortcut. */
  onPlay?: () => void;
  className?: string;
  /** Rendered inside the video context, next to the frame. */
  children?: ReactNode;
};

export function VideoPlayerBlock({
  videos,
  defaultActiveIndex = 0,
  onPlay,
  className,
  children,
}: VideoPlayerBlockProps) {
  const [boundPlay, setBoundPlay] = useState<(() => void) | undefined>();
  const play = boundPlay ?? onPlay;
  const registerPlay = useCallback<PlayRegistrar>((handler) => {
    setBoundPlay(() => handler);
  }, []);

  useEffect(() => {
    if (!play) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "p" && event.key !== "P") {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      if (shouldIgnorePlayShortcut(event.target)) {
        return;
      }
      event.preventDefault();
      play();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [play]);

  return (
    <PlayerLayout.Provider
      videos={videos}
      defaultActiveIndex={defaultActiveIndex}
    >
      <VideoPlayerBlockPlayRegistrarContext.Provider value={registerPlay}>
        {children}
        <VideoPlayerBlockFrame className={className} onPlay={play} />
      </VideoPlayerBlockPlayRegistrarContext.Provider>
    </PlayerLayout.Provider>
  );
}

/** Replaces `onPlay` while mounted. Use this from a child inside `VideoPlayerBlock`. */
export function VideoPlayerBlockBindPlay({ onPlay }: { onPlay: () => void }) {
  const registerPlay = useContext(VideoPlayerBlockPlayRegistrarContext);

  useEffect(() => {
    if (!registerPlay) {
      return;
    }
    registerPlay(onPlay);
    return () => registerPlay(undefined);
  }, [onPlay, registerPlay]);

  return null;
}

function VideoPlayerBlockFrame({
  className,
  onPlay,
}: {
  className?: string;
  onPlay?: () => void;
}) {
  const { state } = PlayerLayout.useContext();

  return (
    <VideoPlayerBlockEnterProvider>
    <PlayerLayout.Root
      data-testid="player-layout"
      data-video-count={state.videos.length}
      className={className}
      style={{ height: "100dvh", paddingInline: "1.5rem" }}
    >
      <PlayerLayout.Background data-testid="player-layout-background">
        <PlayerPreview.Active />
      </PlayerLayout.Background>
      <PlayerLayout.Filter data-testid="player-layout-filter">
        <VideoPlayerBlockShadow />
        <PlayerBlur.Sm />
      </PlayerLayout.Filter>
      <PlayerLayout.Header
        data-testid="player-layout-header"
        className="mx-auto flex w-full max-w-5xl items-center"
        style={{ paddingBlock: "2.75rem" }}
      >
        <VideoPlayerBlockEnterRow index={ENTER_ROW.brand}>
          <VideoPlayerBlockBrand />
        </VideoPlayerBlockEnterRow>
      </PlayerLayout.Header>
      <PlayerLayout.Content
        data-testid="player-layout-content"
        className="mx-auto w-full max-w-5xl"
      >
        <VideoPlayerBlockFeature onPlay={onPlay} />
      </PlayerLayout.Content>
      <PlayerLayout.Footer
        data-testid="player-layout-footer"
        className="flex w-full min-w-0 flex-col items-center justify-center"
        style={{ paddingBlock: "0.5rem" }}
      >
        <VideoPlayerBlockCarousel />
      </PlayerLayout.Footer>
    </PlayerLayout.Root>
    </VideoPlayerBlockEnterProvider>
  );
}

function VideoPlayerBlockShadow() {
  return (
    <PlayerShadow.Root
      horizontal={SHADOW_HORIZONTAL}
      vertical={SHADOW_VERTICAL}
    >
      <PlayerShadow.Left />
      <PlayerShadow.Right minViewport="2xl" />
      <PlayerShadow.Bottom />
    </PlayerShadow.Root>
  );
}

function VideoPlayerBlockBrand() {
  return (
    <PlayerBrand.Root>
      <PlayerBrand.Icon />
      <PlayerBrand.Separator />
      <PlayerBrand.Label>
        <PlayerBrand.LabelLine>Player</PlayerBrand.LabelLine>
        <PlayerBrand.LabelLine>Component</PlayerBrand.LabelLine>
      </PlayerBrand.Label>
    </PlayerBrand.Root>
  );
}

function VideoPlayerBlockFeature({ onPlay }: { onPlay?: () => void }) {
  const transition = PlayerFeature.Crossfade.useTransition(FEATURE_CROSSFADE);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full justify-start p-4",
        featureAlignClassName,
        transition.isAnimating && "relative",
      )}
    >
      {transition.layers.map((layer) => (
        <div
          key={layer.key}
          className={cn(
            transition.isAnimating &&
              cn(
                "absolute inset-0 flex justify-start p-4",
                featureAlignClassName,
              ),
          )}
          style={
            transition.enabled
              ? PlayerFeature.Crossfade.layerStyle(
                  layer.visible,
                  layer.animationDurationMs,
                  transition.maxBlurPx,
                )
              : undefined
          }
          aria-hidden={transition.enabled && !layer.visible}
        >
          <VideoPlayerBlockFeatureBody video={layer.video} onPlay={onPlay} />
        </div>
      ))}
    </div>
  );
}

function VideoPlayerBlockFeatureBody({
  video,
  onPlay,
}: {
  video: Player.Video;
  onPlay?: () => void;
}) {
  const metadata = video.metadata;
  const sourceLink = metadata?.links?.[0];
  const dateLabel = metadata?.date
    ? formatVideoPlayerBlockDate(metadata.date)
    : undefined;
  const durationLabel =
    metadata?.durationLabel ??
    (metadata?.durationSeconds !== undefined
      ? formatFeatureDuration(metadata.durationSeconds)
      : undefined);

  return (
    <PlayerFeature.Root className={featureRootClassName}>
      {metadata?.title || metadata?.description ? (
        <PlayerFeature.Intro>
          {metadata.title ? (
            <VideoPlayerBlockEnterRow index={ENTER_ROW.title}>
              <PlayerFeature.Title>{metadata.title}</PlayerFeature.Title>
            </VideoPlayerBlockEnterRow>
          ) : null}
          {metadata.description ? (
            <VideoPlayerBlockEnterRow index={ENTER_ROW.description}>
              <PlayerFeature.Description>
                {metadata.description}
              </PlayerFeature.Description>
            </VideoPlayerBlockEnterRow>
          ) : null}
        </PlayerFeature.Intro>
      ) : null}
      <VideoPlayerBlockEnterRow index={ENTER_ROW.play}>
        <div className="flex w-full flex-wrap items-center gap-2">
          <PlayerFeature.Play className={playClassName} onClick={onPlay}>
            <span className="sm:hidden">Play</span>
            <span className="hidden sm:inline">Play conversation</span>
          </PlayerFeature.Play>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 max-sm:flex sm:hidden">
            <PlayerFeature.FollowLabel />
            <VideoPlayerBlockSocial />
          </div>
        </div>
      </VideoPlayerBlockEnterRow>
      <VideoPlayerBlockEnterRow index={ENTER_ROW.details}>
        <PlayerFeature.DetailsRow>
          <span className="hidden sm:contents">
            <PlayerFeature.FollowLabel />
            <VideoPlayerBlockSocial />
            <VideoPlayerBlockMeta
              leadingSeparator
              sourceLink={sourceLink}
              date={metadata?.date}
              dateLabel={dateLabel}
              durationLabel={durationLabel}
            />
          </span>
          <span className="contents sm:hidden">
            <VideoPlayerBlockMeta
              sourceLink={sourceLink}
              date={metadata?.date}
              dateLabel={dateLabel}
              durationLabel={durationLabel}
            />
          </span>
        </PlayerFeature.DetailsRow>
      </VideoPlayerBlockEnterRow>
    </PlayerFeature.Root>
  );
}

function VideoPlayerBlockSocial() {
  return (
    <>
      <PlayerFeature.Social.Youtube />
      <PlayerFeature.Social.Spotify />
      <PlayerFeature.Social.ApplePodcasts />
    </>
  );
}

function VideoPlayerBlockMeta({
  leadingSeparator = false,
  sourceLink,
  date,
  dateLabel,
  durationLabel,
}: {
  leadingSeparator?: boolean;
  sourceLink: Player.VideoLink | undefined;
  date: string | undefined;
  dateLabel: string | undefined;
  durationLabel: string | undefined;
}) {
  const hasLink = Boolean(sourceLink);
  const hasDate = Boolean(date && dateLabel);
  const showLinkDot = leadingSeparator && hasLink;
  const showDateDot = hasDate && (leadingSeparator || hasLink);
  const showDurationDot =
    Boolean(durationLabel) && (leadingSeparator || hasLink || hasDate);

  return (
    <>
      {sourceLink ? (
        <>
          {showLinkDot ? <PlayerFeature.Dot /> : null}
          <PlayerFeature.Links className="inline-flex w-auto gap-0 p-0">
            <PlayerFeature.Link
              href={sourceLink.href}
              target="_blank"
              rel="noreferrer"
            >
              {sourceLink.label}
            </PlayerFeature.Link>
          </PlayerFeature.Links>
        </>
      ) : null}
      {date && dateLabel ? (
        <>
          {showDateDot ? <PlayerFeature.Dot /> : null}
          <PlayerFeature.Date dateTime={date}>{dateLabel}</PlayerFeature.Date>
        </>
      ) : null}
      {durationLabel ? (
        <>
          {showDurationDot ? <PlayerFeature.Dot /> : null}
          <PlayerFeature.Duration>{durationLabel}</PlayerFeature.Duration>
        </>
      ) : null}
    </>
  );
}

function VideoPlayerBlockCarousel() {
  const { state, actions } = PlayerLayout.useContext();
  const { videos } = state;

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full min-w-0">
      <PlayerCarousel.Root
        slideCount={videos.length}
        index={state.activeIndex}
        onIndexChange={actions.setActiveIndex}
        slideEnterStaggerMs={CAROUSEL_SLIDE_ENTER.staggerMs}
        slideEnterDurationMs={CAROUSEL_SLIDE_ENTER.durationMs}
        slideEnterMaxBlurPx={CAROUSEL_SLIDE_ENTER.maxBlurPx}
        slideEnterTranslateYRem={CAROUSEL_SLIDE_ENTER.translateYRem}
        slideEnterBaseDelayMs={CAROUSEL_SLIDE_ENTER.baseDelayMs}
      >
        <PlayerCarousel.Controls />
        <PlayerCarousel.Viewport>
          <PlayerCarousel.Track>
            {videos.map((video, index) => (
              <PlayerCarousel.Slide key={`${video.url}-${index}`} index={index}>
                <PlayerCarousel.Media>
                  {video.poster ? (
                    <PlayerCarousel.Image
                      src={video.poster}
                      alt={video.metadata?.title ?? ""}
                    />
                  ) : null}
                </PlayerCarousel.Media>
                <PlayerCarousel.Caption>
                  <PlayerCarousel.Episode index={index + 1} />
                  {video.metadata?.title ? (
                    <PlayerCarousel.Title>
                      {video.metadata.title}
                    </PlayerCarousel.Title>
                  ) : null}
                </PlayerCarousel.Caption>
              </PlayerCarousel.Slide>
            ))}
          </PlayerCarousel.Track>
        </PlayerCarousel.Viewport>
      </PlayerCarousel.Root>
    </div>
  );
}

function VideoPlayerBlockEnterRow({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(VideoPlayerBlockEnterContext);
  const enterDone = context?.enterDone ?? false;
  const skip = enterDone;
  const [visible, setVisible] = useState(skip);

  useLayoutEffect(() => {
    if (skip) {
      setVisible(true);
      return;
    }

    setVisible(false);
    let frameA = 0;
    let frameB = 0;
    frameA = requestAnimationFrame(() => {
      frameB = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(frameA);
      cancelAnimationFrame(frameB);
    };
  }, [skip, index]);

  if (skip) {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return children;
  }

  return (
    <div className={className} style={videoPlayerBlockEnterStyle(visible, index)}>
      {children}
    </div>
  );
}

function videoPlayerBlockEnterStyle(visible: boolean, index: number): CSSProperties {
  const delayMs = index * PAGE_ENTER.staggerMs;
  const y = visible ? 0 : PAGE_ENTER.translateYRem;
  const transition = visible
    ? `opacity ${PAGE_ENTER.durationMs}ms ${ENTER_EASE} ${delayMs}ms, filter ${PAGE_ENTER.durationMs}ms ${ENTER_EASE} ${delayMs}ms, transform ${PAGE_ENTER.durationMs}ms ${ENTER_EASE} ${delayMs}ms`
    : "none";

  return {
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : `blur(${PAGE_ENTER.maxBlurPx}px)`,
    transform: `translateY(${y}rem)`,
    transition,
  };
}

function formatVideoPlayerBlockDate(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shouldIgnorePlayShortcut(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  return false;
}
