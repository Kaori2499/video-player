import { cn } from "@/lib/utils";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import {
  createContext,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

export type PlayerCarouselSlideEase = readonly [
  number,
  number,
  number,
  number,
];

const PLAYER_CAROUSEL_SLIDE_EASE_DEFAULT: PlayerCarouselSlideEase = [
  0.4,
  0.7,
  0.35,
  0.86,
];

function formatSlideTransitionTimingFunction(
  ease: PlayerCarouselSlideEase,
): string {
  return `cubic-bezier(${ease.join(", ")})`;
}

function evaluateSlideTransitionEase(
  progress: number,
  ease: PlayerCarouselSlideEase,
) {
  return cubicBezier(progress, ease[0], ease[1], ease[2], ease[3]);
}

function cubicBezier(
  progress: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  let t = progress;
  for (let index = 0; index < 6; index += 1) {
    const slope = slopeX(t);
    if (Math.abs(slope) < 1e-3) break;
    const error = sampleX(t) - progress;
    if (Math.abs(error) < 1e-4) break;
    t = Math.min(1, Math.max(0, t - error / slope));
  }

  return sampleY(t);
}

/** Idle thumbnail height × this scale = reserved frame height; active slide width × this scale. */
const PLAYER_CAROUSEL_ACTIVE_MEDIA_SCALE = 1.4;
const CAROUSEL_VIDEO_ASPECT = 9 / 16;

function shouldIgnoreCarouselKeyboardEvent(target: EventTarget | null) {
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
  if (target.closest(".dialkit-root")) {
    return true;
  }
  return false;
}

export const PLAYER_CAROUSEL_DEFAULTS = {
  gapRem: 2,
  slideWidthRem: 8.75,
  slideRadiusRem: 0.5,
  paddingTopRem: 1.375,
  paddingBottomRem: 3,
  captionTextSizeRem: 0.75,
  navButtonBg: "#6a6a6a26",
  navButtonHoverBg: "#a6a6a640",
  slideTransitionDurationMs: 320,
  slideTransitionEase: PLAYER_CAROUSEL_SLIDE_EASE_DEFAULT,
} as const;

type PlayerCarouselMetrics = {
  gapRem: number;
  slideWidthRem: number;
  slideRadiusRem: number;
  captionTextSizeRem: number;
  paddingTopRem: number;
  navButtonBg: string;
  navButtonHoverBg: string;
  slideTransitionDurationMs: number;
  slideTransitionEase: PlayerCarouselSlideEase;
  slideTransitionTimingFunction: string;
};

type PlayerCarouselState = {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  slideCount: number;
  scrollToIndex: (index: number) => void;
  registerSlideRef: (index: number, node: HTMLDivElement | null) => void;
  controlsRef: RefObject<HTMLDivElement>;
  viewportRef: RefObject<HTMLDivElement>;
  bleedLeftPx: number;
  bleedWidthPx: number;
  leadSpacerPx: number;
  trailSpacerPx: number;
};

type PlayerCarouselContextValue = PlayerCarouselMetrics & PlayerCarouselState;

const PlayerCarouselContext = createContext<PlayerCarouselContextValue | null>(
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
  /** Width expansion and scroll alignment duration in milliseconds. */
  slideTransitionDurationMs?: number;
  /** Cubic-bezier control points; keep in sync with scroll animation. */
  slideTransitionEase?: PlayerCarouselSlideEase;
  /** Total slides; required for prev/next navigation bounds. */
  slideCount?: number;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  /** Arrow Left / Arrow Right navigate prev/next when not typing in a field. @default true */
  keyboardNavigation?: boolean;
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
  slideTransitionDurationMs = PLAYER_CAROUSEL_DEFAULTS.slideTransitionDurationMs,
  slideTransitionEase = PLAYER_CAROUSEL_DEFAULTS.slideTransitionEase,
  slideCount = 0,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  keyboardNavigation = true,
  className,
  style,
  ...props
}: PlayerCarouselRootProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef(new Map<number, HTMLDivElement>());
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const [bleedLeftPx, setBleedLeftPx] = useState(0);
  const [bleedWidthPx, setBleedWidthPx] = useState(0);
  const [leadSpacerPx, setLeadSpacerPx] = useState(0);
  const [trailSpacerPx, setTrailSpacerPx] = useState(0);
  const slideTransitionTimingFunction = useMemo(
    () => formatSlideTransitionTimingFunction(slideTransitionEase),
    [slideTransitionEase],
  );
  const metricsRef = useRef({
    gapRem,
    slideWidthRem,
    slideTransitionDurationMs,
    slideTransitionEase,
  });
  const scrollFrameRef = useRef<number | null>(null);
  const skipScrollAnimationRef = useRef(true);

  metricsRef.current = {
    gapRem,
    slideWidthRem,
    slideTransitionDurationMs,
    slideTransitionEase,
  };

  const selectedIndex = controlledIndex ?? uncontrolledIndex;

  const cancelScrollAnimation = useCallback(() => {
    if (scrollFrameRef.current === null) return;
    cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = null;
  }, []);

  const scrollLeftForIndex = useCallback((targetIndex: number) => {
    const rootFontSize =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16;
    const { gapRem: gap, slideWidthRem: slideWidth } = metricsRef.current;
    return Math.max(0, targetIndex * (slideWidth + gap) * rootFontSize);
  }, []);

  const alignSlideWithControls = useCallback(
    (targetIndex: number, behavior: ScrollBehavior = "auto") => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const destination = scrollLeftForIndex(targetIndex);
      if (behavior === "auto") {
        cancelScrollAnimation();
        viewport.scrollLeft = destination;
        return;
      }

      const start = viewport.scrollLeft;
      if (Math.abs(destination - start) < 0.5) {
        viewport.scrollLeft = destination;
        return;
      }

      cancelScrollAnimation();
      const startedAt = performance.now();
      const { slideTransitionDurationMs: durationMs, slideTransitionEase: ease } =
        metricsRef.current;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / durationMs);
        viewport.scrollLeft =
          start +
          (destination - start) * evaluateSlideTransitionEase(progress, ease);
        if (progress < 1) {
          scrollFrameRef.current = requestAnimationFrame(tick);
          return;
        }
        scrollFrameRef.current = null;
      };
      scrollFrameRef.current = requestAnimationFrame(tick);
    },
    [cancelScrollAnimation, scrollLeftForIndex],
  );

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

  const scrollToIndex = useCallback(
    (targetIndex: number) => {
      alignSlideWithControls(targetIndex, "smooth");
    },
    [alignSlideWithControls],
  );

  useEffect(() => {
    if (!keyboardNavigation || slideCount <= 0) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      if (shouldIgnoreCarouselKeyboardEvent(event.target)) {
        return;
      }

      if (event.key === "ArrowLeft" && selectedIndex > 0) {
        event.preventDefault();
        setSelectedIndex(selectedIndex - 1);
        return;
      }
      if (event.key === "ArrowRight" && selectedIndex < slideCount - 1) {
        event.preventDefault();
        setSelectedIndex(selectedIndex + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    keyboardNavigation,
    selectedIndex,
    setSelectedIndex,
    slideCount,
  ]);

  useLayoutEffect(() => {
    if (skipScrollAnimationRef.current) {
      skipScrollAnimationRef.current = false;
      alignSlideWithControls(selectedIndex, "auto");
      return;
    }

    alignSlideWithControls(selectedIndex, "smooth");
    return cancelScrollAnimation;
  }, [alignSlideWithControls, cancelScrollAnimation, selectedIndex]);

  const syncScrollChrome = useCallback(() => {
    const viewport = viewportRef.current;
    const controls = controlsRef.current;
    if (!viewport || !controls) return;

    const layout = viewport.closest("[data-vp-layout]");
    const bounds = (layout ?? document.documentElement).getBoundingClientRect();
    const parent = viewport.parentElement?.getBoundingClientRect();
    const nextBleedLeft = parent ? bounds.left - parent.left : 0;
    const nextBleedWidth = bounds.width;
    const nextLead = Math.max(0, controls.getBoundingClientRect().left - bounds.left);
    const rootFontSize =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16;
    const idleSlidePx = slideWidthRem * rootFontSize;
    const nextTrail = Math.max(0, nextBleedWidth - nextLead - idleSlidePx);

    setBleedLeftPx((current) =>
      current === nextBleedLeft ? current : nextBleedLeft,
    );
    setBleedWidthPx((current) =>
      current === nextBleedWidth ? current : nextBleedWidth,
    );
    setLeadSpacerPx((current) => (current === nextLead ? current : nextLead));
    setTrailSpacerPx((current) =>
      current === nextTrail ? current : nextTrail,
    );
  }, [slideWidthRem]);

  useLayoutEffect(() => {
    syncScrollChrome();
  }, [syncScrollChrome, selectedIndex]);

  useLayoutEffect(() => {
    alignSlideWithControls(selectedIndex, "auto");
  }, [alignSlideWithControls, leadSpacerPx, trailSpacerPx]);

  useEffect(() => {
    const onResize = () => {
      syncScrollChrome();
      alignSlideWithControls(selectedIndex, "auto");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [alignSlideWithControls, selectedIndex, syncScrollChrome]);

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
      slideTransitionDurationMs,
      slideTransitionEase,
      slideTransitionTimingFunction,
      selectedIndex,
      setSelectedIndex,
      slideCount,
      scrollToIndex,
      registerSlideRef,
      controlsRef,
      viewportRef,
      bleedLeftPx,
      bleedWidthPx,
      leadSpacerPx,
      trailSpacerPx,
    }),
    [
      gapRem,
      slideWidthRem,
      slideRadiusRem,
      captionTextSizeRem,
      paddingTopRem,
      navButtonBg,
      navButtonHoverBg,
      slideTransitionDurationMs,
      slideTransitionEase,
      slideTransitionTimingFunction,
      selectedIndex,
      setSelectedIndex,
      slideCount,
      scrollToIndex,
      registerSlideRef,
      bleedLeftPx,
      bleedWidthPx,
      leadSpacerPx,
      trailSpacerPx,
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
  const { selectedIndex, setSelectedIndex, slideCount, controlsRef } =
    usePlayerCarouselContext("Controls");

  const canGoPrev = slideCount > 0 && selectedIndex > 0;
  const canGoNext = slideCount > 0 && selectedIndex < slideCount - 1;

  const goPrev = () => {
    if (!canGoPrev) return;
    setSelectedIndex(selectedIndex - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div
      ref={controlsRef}
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
  const { viewportRef, paddingTopRem, bleedLeftPx, bleedWidthPx } =
    usePlayerCarouselContext("Viewport");

  return (
    <div
      ref={viewportRef}
      data-vp-carousel=""
      className={cn(
        "min-w-0 max-w-none overflow-x-auto overflow-y-hidden",
        className,
      )}
      style={{
        paddingTop: `${paddingTopRem}rem`,
        marginLeft: bleedLeftPx,
        width: bleedWidthPx > 0 ? bleedWidthPx : "100%",
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
  const { gapRem, leadSpacerPx, trailSpacerPx } =
    usePlayerCarouselContext("Track");

  return (
    <div
      data-vp-carousel-part="track"
      className={cn("flex w-max max-w-none flex-nowrap", className)}
      style={{
        gap: `${gapRem}rem`,
        paddingLeft: leadSpacerPx,
        paddingRight: trailSpacerPx,
        ...style,
      }}
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
    slideTransitionDurationMs,
    slideTransitionTimingFunction,
    selectedIndex,
    setSelectedIndex,
    registerSlideRef,
  } = usePlayerCarouselContext("Slide");
  const active = index === selectedIndex;

  return (
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
        transition: `width ${slideTransitionDurationMs}ms ${slideTransitionTimingFunction}`,
        ...style,
      }}
      onClick={() => setSelectedIndex(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelectedIndex(index);
        }
      }}
      {...props}
    >
      {children}
    </div>
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
        className="aspect-video w-full shrink-0 overflow-hidden"
        style={{
          borderRadius: `${slideRadiusRem}rem`,
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
