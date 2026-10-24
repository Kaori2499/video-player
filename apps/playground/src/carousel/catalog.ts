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

/** Prefix public/ asset paths with Vite base (required on GitHub project Pages). */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const cleaned = path.replace(/^\//, "");
  return `${base}${cleaned}`;
}

export const CAROUSEL_CATALOG_URL = assetUrl("carousel/videos.json");

export function withAssetBase(entry: CarouselCatalogEntry): CarouselCatalogEntry {
  return {
    ...entry,
    cover: assetUrl(entry.cover),
    video: assetUrl(entry.video),
  };
}

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