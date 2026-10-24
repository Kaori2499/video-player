import type { Player } from "@component-template/react";

export type CarouselCatalogEntry = {
  id: string;
  cover: string;
  video: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  durationLabel: string;
  sizeMB: number;
  license: string;
  source: string;
  credit: string;
};

export const CAROUSEL_CATALOG_URL = "/carousel/videos.json";

export function formatCarouselDate(iso: string): string {
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

export function carouselEntryToPlayerVideo(
  entry: CarouselCatalogEntry,
): Player.Video {
  return {
    url: entry.video,
    metadata: {
      title: entry.title,
      description: entry.description,
      date: entry.date,
      durationSeconds: entry.duration,
      durationLabel: entry.durationLabel,
      links: [{ label: entry.credit, href: entry.source }],
    },
  };
}
