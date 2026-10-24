import type { VideoPlayerAsset } from "@component-template/react";
import type { CarouselCatalogEntry } from "../../carousel/catalog";

export function carouselEntriesToPlaybackAssets(
  entries: CarouselCatalogEntry[],
): VideoPlayerAsset[] {
  return entries.map((entry) => ({
    id: entry.id,
    src: entry.video,
    title: entry.title,
    description: entry.description,
    poster: entry.cover,
  }));
}
