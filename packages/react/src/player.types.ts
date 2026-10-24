import type { ReactNode } from "react";

export namespace Player {
  export type VideoLink = {
    label: string;
    href: string;
  };

  export type VideoMetadata = {
    title?: string;
    description?: string;
    links?: VideoLink[];
    date?: string;
    /** Preferred source for compact feature duration display. */
    durationSeconds?: number;
    durationLabel?: string;
  };

  export type Video = {
    url: string;
    metadata?: VideoMetadata;
  };

  export type ContextState = {
    videos: Video[];
    activeIndex: number;
    activeVideo: Video | undefined;
  };

  export type ContextActions = {
    setActiveIndex: (index: number) => void;
  };

  export type ContextMeta = Record<string, never>;

  export type Context = {
    state: ContextState;
    actions: ContextActions;
    meta: ContextMeta;
  };

  export type ProviderProps = {
    videos: Video[];
    children: ReactNode;
    defaultActiveIndex?: number;
  };
}
