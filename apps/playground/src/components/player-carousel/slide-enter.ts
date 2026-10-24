import type { PlayerPageEnterDialValues } from "../player-enter/dialkit";
import type { CarouselSlideEnterDialValues } from "./dialkit";

export type CarouselSlideEnterSource = CarouselSlideEnterDialValues;

export function resolveCarouselSlideEnter(
  carousel: CarouselSlideEnterDialValues,
  override?: PlayerPageEnterDialValues["carouselSlides"],
): CarouselSlideEnterSource {
  return override ?? carousel;
}
