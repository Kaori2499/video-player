import type { Player } from "@component-template/react";
import { useEffect, useMemo, useState } from "react";
import {
  CAROUSEL_CATALOG_URL,
  type CarouselCatalogEntry,
  carouselEntryToPlayerVideo,
  withAssetBase,
} from "./catalog";

let catalogRequest: Promise<CarouselCatalogEntry[]> | null = null;

function loadCarouselCatalog() {
  if (!catalogRequest) {
    catalogRequest = fetch(CAROUSEL_CATALOG_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load carousel catalog (${response.status})`);
        }
        return response.json() as Promise<CarouselCatalogEntry[]>;
      })
      .then((items) => items.map(withAssetBase))
      .catch((error) => {
        catalogRequest = null;
        throw error;
      });
  }
  return catalogRequest;
}

export function useCarouselCatalog() {
  const [entries, setEntries] = useState<CarouselCatalogEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    loadCarouselCatalog()
      .then((items) => {
        if (!cancelled) {
          setEntries(items);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([]);
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const videos = useMemo(
    () => entries.map((entry) => carouselEntryToPlayerVideo(entry)),
    [entries],
  );

  return { entries, videos, status };
}

export type CarouselCatalogVideos = Player.Video[];