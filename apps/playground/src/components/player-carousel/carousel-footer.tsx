import { PlayerCarousel } from "@component-template/react";
import type { PlayerCarouselDialValues } from "./dialkit";

const PLAYGROUND_CAROUSEL_IMAGES = [
  { src: "/carousel/01-mountains.jpg", alt: "Mountains", name: "Mountains" },
  {
    src: "/carousel/02-forest-fog.jpg",
    alt: "Forest in fog",
    name: "Forest in fog",
  },
  {
    src: "/carousel/03-night-peaks.jpg",
    alt: "Night peaks",
    name: "Night peaks",
  },
  { src: "/carousel/04-ocean.jpg", alt: "Ocean", name: "Ocean" },
  {
    src: "/carousel/05-city-night.jpg",
    alt: "City at night",
    name: "City at night",
  },
  { src: "/carousel/06-aurora.jpg", alt: "Aurora", name: "Aurora" },
  { src: "/carousel/07-desert.jpg", alt: "Desert", name: "Desert" },
  { src: "/carousel/08-lake.jpg", alt: "Lake", name: "Lake" },
  { src: "/carousel/09-canyon.jpg", alt: "Canyon", name: "Canyon" },
  { src: "/carousel/10-coast.jpg", alt: "Coast", name: "Coast" },
  { src: "/carousel/11-stars.jpg", alt: "Stars", name: "Stars" },
] as const;

export function PlayerCarouselFooter({
  carousel,
}: {
  carousel: PlayerCarouselDialValues;
}) {
  return (
    <div className="w-full min-w-0">
      <PlayerCarousel.Root
        slideCount={PLAYGROUND_CAROUSEL_IMAGES.length}
        gapRem={carousel.gapRem}
        slideWidthRem={carousel.slideWidthRem}
        slideRadiusRem={carousel.slideRadiusRem}
        paddingTopRem={carousel.paddingTopRem}
        paddingBottomRem={carousel.paddingBottomRem}
        captionTextSizeRem={carousel.captionTextSizeRem}
        navButtonBg={carousel.navButtonBg}
        navButtonHoverBg={carousel.navButtonHoverBg}
      >
        <PlayerCarousel.Controls />
        <PlayerCarousel.Viewport>
          <PlayerCarousel.Track>
            {PLAYGROUND_CAROUSEL_IMAGES.map((image, index) => (
              <PlayerCarousel.Slide key={image.src} index={index}>
                <PlayerCarousel.Media>
                  <PlayerCarousel.Image src={image.src} alt={image.alt} />
                </PlayerCarousel.Media>
                <PlayerCarousel.Caption>
                  <PlayerCarousel.Episode index={index + 1} />
                  <PlayerCarousel.Title>{image.name}</PlayerCarousel.Title>
                </PlayerCarousel.Caption>
              </PlayerCarousel.Slide>
            ))}
          </PlayerCarousel.Track>
        </PlayerCarousel.Viewport>
      </PlayerCarousel.Root>
    </div>
  );
}
