import {
  PlayerCarousel,
  PlayerLayout,
  type PlayerCarouselSlideEase,
} from "@component-template/react";
import { useCarouselCatalog } from "../../carousel/useCarouselCatalog";
import type { PlayerPageEnterDialValues } from "../player-enter/dialkit";
import type { CarouselSlideEnterDialValues, PlayerCarouselDialValues } from "./dialkit";
import { resolveCarouselSlideEnter } from "./slide-enter";

function slideTransitionEaseFromDial(
  curve: PlayerCarouselDialValues["slideTransitionCurve"],
): PlayerCarouselSlideEase {
  if (curve.type !== "easing") {
    return [0.4, 0.7, 0.35, 0.86];
  }
  return curve.ease;
}

export function PlayerCarouselFooter({
  carousel,
  slideEnter,
  slideEnterEpoch = 0,
  slideEnterBaseDelayMs = 0,
}: {
  carousel: PlayerCarouselDialValues;
  /** When set (main page), overrides `carousel.slideEnter` from the carousel panel. */
  slideEnter?: CarouselSlideEnterDialValues | PlayerPageEnterDialValues["carouselSlides"];
  /** Bump with page enter replay so per-slide animation runs again. */
  slideEnterEpoch?: number;
  /** Wait until the carousel's slot in the page-enter sequence. */
  slideEnterBaseDelayMs?: number;
}) {
  const { entries, status } = useCarouselCatalog();
  const { state, actions } = PlayerLayout.useContext();
  const slideTransitionEase = slideTransitionEaseFromDial(
    carousel.slideTransitionCurve,
  );
  const slideEnterConfig = resolveCarouselSlideEnter(
    carousel.slideEnter,
    slideEnter,
  );

  if (status !== "ready" || entries.length === 0) {
    return null;
  }

  return (
    <div className="w-full min-w-0">
      <PlayerCarousel.Root
        slideCount={entries.length}
        index={state.activeIndex}
        onIndexChange={actions.setActiveIndex}
        gapRem={carousel.gapRem}
        slideWidthRem={carousel.slideWidthRem}
        slideRadiusRem={carousel.slideRadiusRem}
        paddingTopRem={carousel.paddingTopRem}
        paddingBottomRem={carousel.paddingBottomRem}
        captionTextSizeRem={carousel.captionTextSizeRem}
        navButtonBg={carousel.navButtonBg}
        navButtonHoverBg={carousel.navButtonHoverBg}
        slideTransitionDurationMs={carousel.slideTransitionDurationMs}
        slideTransitionEase={slideTransitionEase}
        slideEnterEnabled={slideEnterConfig.enabled}
        slideEnterStaggerMs={slideEnterConfig.staggerMs}
        slideEnterDurationMs={slideEnterConfig.durationMs}
        slideEnterMaxBlurPx={slideEnterConfig.maxBlurPx}
        slideEnterTranslateYRem={slideEnterConfig.translateYRem}
        slideEnterBaseDelayMs={slideEnterBaseDelayMs}
        slideEnterEpoch={slideEnterEpoch}
      >
        <PlayerCarousel.Controls />
        <PlayerCarousel.Viewport>
          <PlayerCarousel.Track>
            {entries.map((entry, index) => (
              <PlayerCarousel.Slide key={entry.id} index={index}>
                <PlayerCarousel.Media>
                  <PlayerCarousel.Image src={entry.cover} alt={entry.title} />
                </PlayerCarousel.Media>
                <PlayerCarousel.Caption>
                  <PlayerCarousel.Episode index={index + 1} />
                  <PlayerCarousel.Title>{entry.title}</PlayerCarousel.Title>
                </PlayerCarousel.Caption>
              </PlayerCarousel.Slide>
            ))}
          </PlayerCarousel.Track>
        </PlayerCarousel.Viewport>
      </PlayerCarousel.Root>
    </div>
  );
}
