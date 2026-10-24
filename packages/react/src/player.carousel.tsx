import { cn } from "@/lib/utils";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import {
  createContext,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

/** Idle thumbnail height × this scale = reserved frame height; active slide width × this scale. */
const PLAYER_CAROUSEL_ACTIVE_MEDIA_SCALE = 1.4;
const CAROUSEL_VIDEO_ASPECT = 9 / 16;

export const PLAYER_CAROUSEL_DEFAULTS = {
  gapRem: 2,
  slideWidthRem: 8.75,
  slideRadiusRem: 0.5,
  paddingTopRem: 1,
  paddingBottomRem: 3,
  captionTextSizeRem: 0.75,
  navButtonBg: "#6a6a6a26",
  navButtonHoverBg: "#a6a6a640",
} as const;

type PlayerCarouselMetrics = {
  gapRem: number;
  slideWidthRem: number;
  slideRadiusRem: number;
  captionTextSizeRem: number;
  paddingTopRem: number;
  navButtonBg: string;
  navButtonHoverBg: string;
};

type PlayerCarouselState = {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  slideCount: number;
  scrollToIndex: (index: number) => void;
  registerSlideRef: (index: number, node: HTMLDivElement | null) => void;
  viewportRef: RefObject<HTMLDivElement>;
};

type PlayerCarouselContextValue = PlayerCarouselMetrics & PlayerCarouselState;

const PlayerCarouselContext = createContext<PlayerCarouselContextValue | null>(
  null,
);

const PlayerCarouselSlideContext = createContext<{ active: boolean } | null>(
  null,
);

function usePlayerCarouselContext(part: string): PlayerCarouselContextValue {
  const context = useContext(PlayerCarouselContext);
  if (!context) {
    throw new Error(
      `PlayerCarousel.${part} must be used within PlayerCarousel.Root`,
    );
  }
  return context;
}

function usePlayerCarouselSlide(part: string) {
  const slide = useContext(PlayerCarouselSlideContext);
  if (!slide) {
    throw new Error(
      `PlayerCarousel.${part} must be used within PlayerCarousel.Slide`,
    );
  }
  return slide;
}

export type PlayerCarouselRootProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gapRem?: number;
  slideWidthRem?: number;
  slideRadiusRem?: number;
  paddingTopRem?: number;
  paddingBottomRem?: number;
  captionTextSizeRem?: number;
  navButtonBg?: string;
  navButtonHoverBg?: string;
  /** Total slides; required for prev/next navigation bounds. */
  slideCount?: number;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
};

function PlayerCarouselRoot({
  children,
  gapRem = PLAYER_CAROUSEL_DEFAULTS.gapRem,
  slideWidthRem = PLAYER_CAROUSEL_DEFAULTS.slideWidthRem,
  slideRadiusRem = PLAYER_CAROUSEL_DEFAULTS.slideRadiusRem,
  paddingTopRem = PLAYER_CAROUSEL_DEFAULTS.paddingTopRem,
  paddingBottomRem = PLAYER_CAROUSEL_DEFAULTS.paddingBottomRem,
  captionTextSizeRem = PLAYER_CAROUSEL_DEFAULTS.captionTextSizeRem,
  navButtonBg = PLAYER_CAROUSEL_DEFAULTS.navButtonBg,
  navButtonHoverBg = PLAYER_CAROUSEL_DEFAULTS.navButtonHoverBg,
  slideCount = 0,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  className,
  style,
  ...props
}: PlayerCarouselRootProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef(new Map<number, HTMLDivElement>());
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);

  const selectedIndex = controlledIndex ?? uncontrolledIndex;

  const setSelectedIndex = useCallback(
    (nextIndex: number) => {
      const clamped =
        slideCount > 0
          ? Math.min(Math.max(nextIndex, 0), slideCount - 1)
          : Math.max(nextIndex, 0);

      if (controlledIndex === undefined) {
        setUncontrolledIndex(clamped);
      }
      onIndexChange?.(clamped);
    },
    [controlledIndex, onIndexChange, slideCount],
  );

  const scrollToIndex = useCallback((targetIndex: number) => {
    const slide = slideRefs.current.get(targetIndex);
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, []);

  const registerSlideRef = useCallback(
    (slideIndex: number, node: HTMLDivElement | null) => {
      if (node) {
        slideRefs.current.set(slideIndex, node);
      } else {
        slideRefs.current.delete(slideIndex);
      }
    },
    [],
  );

  const contextValue = useMemo<PlayerCarouselContextValue>(
    () => ({
      gapRem,
      slideWidthRem,
      slideRadiusRem,
      captionTextSizeRem,
      paddingTopRem,
      navButtonBg,
      navButtonHoverBg,
      selectedIndex,
      setSelectedIndex,
      slideCount,
      scrollToIndex,
      registerSlideRef,
      viewportRef,
    }),
    [
      gapRem,
      slideWidthRem,
      slideRadiusRem,
      captionTextSizeRem,
      paddingTopRem,
      navButtonBg,
      navButtonHoverBg,
      selectedIndex,
      setSelectedIndex,
      slideCount,
      scrollToIndex,
      registerSlideRef,
    ],
  );

  return (
    <PlayerCarouselContext.Provider value={contextValue}>
      <div
        data-vp-carousel-root=""
        className={cn("flex w-full min-w-0 flex-col", className)}
        style={{
          paddingBottom: `${paddingBottomRem}rem`,
          ["--vp-carousel-nav-btn-bg" as string]: navButtonBg,
          ["--vp-carousel-nav-btn-hover-bg" as string]: navButtonHoverBg,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </PlayerCarouselContext.Provider>
  );
}

const navButtonClassName =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--vp-carousel-nav-btn-bg)] p-0 text-foreground transition-colors hover:bg-[var(--vp-carousel-nav-btn-hover-bg)] disabled:cursor-not-allowed disabled:opacity-40";

export type PlayerCarouselControlsProps = HTMLAttributes<HTMLDivElement>;

function PlayerCarouselControls({
  className,
  ...props
}: PlayerCarouselControlsProps) {
  const {
    selectedIndex,
    setSelectedIndex,
    slideCount,
    scrollToIndex,
  } = usePlayerCarouselContext("Controls");

  const canGoPrev = slideCount > 0 && selectedIndex > 0;
  const canGoNext = slideCount > 0 && selectedIndex < slideCount - 1;

  const goPrev = () => {
    if (!canGoPrev) return;
    const next = selectedIndex - 1;
    setSelectedIndex(next);
    scrollToIndex(next);
  };

  const goNext = () => {
    if (!canGoNext) return;
    const next = selectedIndex + 1;
    setSelectedIndex(next);
    scrollToIndex(next);
  };

  return (
    <div
      data-vp-carousel-part="controls"
      className={cn(
        "flex items-center justify-start gap-2",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        data-vp-carousel-part="nav-prev"
        className={navButtonClassName}
        aria-label="Previous slide"
        disabled={!canGoPrev}
        onClick={goPrev}
      >
        <CaretLeftIcon className="size-4" weight="bold" />
      </button>
      <button
        type="button"
        data-vp-carousel-part="nav-next"
        className={navButtonClassName}
        aria-label="Next slide"
        disabled={!canGoNext}
        onClick={goNext}
      >
        <CaretRightIcon className="size-4" weight="bold" />
      </button>
    </div>
  );
}

export type PlayerCarouselViewportProps = HTMLAttributes<HTMLDivElement>;

function PlayerCarouselViewport({
  children,
  className,
  style,
  ...props
}: PlayerCarouselViewportProps) {
  const { viewportRef, paddingTopRem } = usePlayerCarouselContext("Viewport");

  return (
    <div
      ref={viewportRef}
      data-vp-carousel=""
      className={cn(
        "w-full min-w-0 overflow-x-auto overflow-y-hidden",
        className,
      )}
      style={{
        paddingTop: `${paddingTopRem}rem`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerCarouselTrackProps = HTMLAttributes<HTMLDivElement>;

function PlayerCarouselTrack({
  children,
  className,
  style,
  ...props
}: PlayerCarouselTrackProps) {
  const { gapRem } = usePlayerCarouselContext("Track");

  return (
    <div
      data-vp-carousel-part="track"
      className={cn("flex w-max max-w-none flex-nowrap", className)}
      style={{ gap: `${gapRem}rem`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerCarouselSlideProps = HTMLAttributes<HTMLDivElement> & {
  /** 0-based slide index (used for selection and navigation). */
  index: number;
};

function PlayerCarouselSlide({
  index,
  children,
  className,
  style,
  ...props
}: PlayerCarouselSlideProps) {
  const {
    slideWidthRem,
    selectedIndex,
    setSelectedIndex,
    registerSlideRef,
    scrollToIndex,
  } = usePlayerCarouselContext("Slide");
  const active = index === selectedIndex;

  return (
    <PlayerCarouselSlideContext.Provider value={{ active }}>
      <div
        ref={(node) => registerSlideRef(index, node)}
        data-vp-carousel-part="slide"
        data-vp-carousel-slide-index={index}
        role="button"
        tabIndex={0}
        data-vp-carousel-slide-active={active ? "" : undefined}
        className={cn("flex shrink-0 cursor-pointer flex-col", className)}
        style={{
          width: `${
            slideWidthRem * (active ? PLAYER_CAROUSEL_ACTIVE_MEDIA_SCALE : 1)
          }rem`,
          ...style,
        }}
        onClick={() => {
          setSelectedIndex(index);
          scrollToIndex(index);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedIndex(index);
            scrollToIndex(index);
          }
        }}
        {...props}
      >
        {children}
      </div>
    </PlayerCarouselSlideContext.Provider>
  );
}

export type PlayerCarouselMediaProps = HTMLAttributes<HTMLDivElement>;

function PlayerCarouselMedia({
  children,
  className,
  style,
  ...props
}: PlayerCarouselMediaProps) {
  const { slideRadiusRem, slideWidthRem } = usePlayerCarouselContext("Media");
  const { active } = usePlayerCarouselSlide("Media");
  const idleVideoHeightRem = slideWidthRem * CAROUSEL_VIDEO_ASPECT;
  const frameHeightRem = idleVideoHeightRem * PLAYER_CAROUSEL_ACTIVE_MEDIA_SCALE;

  return (
    <div
      data-vp-carousel-part="media-frame"
      className={cn("flex w-full flex-col justify-end", className)}
      style={{
        height: `${frameHeightRem}rem`,
        ...style,
      }}
      {...props}
    >
      <div
        data-vp-carousel-part="media"
        data-vp-carousel-media-active={active ? "" : undefined}
        className="aspect-video w-full shrink-0 overflow-hidden transition-shadow"
        style={{
          borderRadius: `${slideRadiusRem}rem`,
          boxShadow: active ? "0 0 0 2px white" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export type PlayerCarouselImageProps = ImgHTMLAttributes<HTMLImageElement>;

function PlayerCarouselImage({
  className,
  alt = "",
  ...props
}: PlayerCarouselImageProps) {
  return (
    <img
      data-vp-carousel-part="image"
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export type PlayerCarouselCaptionProps = HTMLAttributes<HTMLDivElement>;

function PlayerCarouselCaption({
  children,
  className,
  style,
  ...props
}: PlayerCarouselCaptionProps) {
  const { captionTextSizeRem } = usePlayerCarouselContext("Caption");

  return (
    <div
      data-vp-carousel-part="caption"
      className={cn(
        "mt-2 flex w-full flex-col items-start gap-0.5 text-left font-normal leading-snug text-foreground",
        className,
      )}
      style={{
        fontSize: `${captionTextSizeRem}rem`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerCarouselEpisodeProps = HTMLAttributes<HTMLSpanElement> & {
  /** 1-based episode order (renders as EPISODE 01, EPISODE 02, …). */
  index: number;
};

function PlayerCarouselEpisode({
  index,
  className,
  ...props
}: PlayerCarouselEpisodeProps) {
  const label = `EPISODE ${String(index).padStart(2, "0")}`;

  return (
    <span
      data-vp-carousel-part="episode"
      className={cn(
        "font-mono uppercase tracking-wide opacity-75",
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}

export type PlayerCarouselTitleProps = HTMLAttributes<HTMLSpanElement>;

function PlayerCarouselTitle({
  children,
  className,
  ...props
}: PlayerCarouselTitleProps) {
  return (
    <span
      data-vp-carousel-part="title"
      className={cn("font-sans font-semibold", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export const PlayerCarousel = {
  Root: PlayerCarouselRoot,
  Controls: PlayerCarouselControls,
  Viewport: PlayerCarouselViewport,
  Track: PlayerCarouselTrack,
  Slide: PlayerCarouselSlide,
  Media: PlayerCarouselMedia,
  Image: PlayerCarouselImage,
  Caption: PlayerCarouselCaption,
  Episode: PlayerCarouselEpisode,
  Title: PlayerCarouselTitle,
};
