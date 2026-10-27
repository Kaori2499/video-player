import { useEffect, useRef, useState } from "react";
import type { Player } from "./player.types";
import { usePlayerContext } from "./player.context";

export type PlayerPreviewUrlProps = {
  url: string;
};

export const PLAYER_PREVIEW_CROSSFADE_MS = 320;

type PlayerPreviewMode = "loop" | "first-frame";

function pauseOnFirstFrame(video: HTMLVideoElement) {
  video.pause();
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return;
  }
  if (video.currentTime > 0) {
    video.currentTime = 0;
    return;
  }
}

type PlayerPreviewVideoLayerProps = {
  url: string;
  mode: PlayerPreviewMode;
  visible: boolean;
  playing: boolean;
  poster?: string;
  crossfadeDurationMs: number;
  onCanPlay?: () => void;
};

function PlayerPreviewVideoLayer({
  url,
  mode,
  visible,
  playing,
  poster,
  crossfadeDurationMs,
  onCanPlay,
}: PlayerPreviewVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const opacityTransition =
    crossfadeDurationMs > 0
      ? `opacity ${crossfadeDurationMs}ms cubic-bezier(0, 0, 0.58, 1)`
      : "none";

  useEffect(() => {
    setMediaReady(false);
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (mode === "loop" && playing) {
      void video.play().catch(() => {});
      return;
    }

    video.pause();
    if (mode === "first-frame") {
      pauseOnFirstFrame(video);
    }
  }, [mode, playing, url]);

  useEffect(() => {
    if (mode !== "first-frame") {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const syncFirstFrame = () => {
      pauseOnFirstFrame(video);
    };

    video.addEventListener("loadeddata", syncFirstFrame);
    video.addEventListener("seeked", syncFirstFrame);
    syncFirstFrame();

    return () => {
      video.removeEventListener("loadeddata", syncFirstFrame);
      video.removeEventListener("seeked", syncFirstFrame);
    };
  }, [mode, url]);

  const onCanPlayRef = useRef(onCanPlay);
  const playingRef = useRef(playing);
  onCanPlayRef.current = onCanPlay;
  playingRef.current = playing;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const notify = () => {
      setMediaReady(true);
      if (mode === "loop" && playingRef.current) {
        void video.play().catch(() => {});
      }
      onCanPlayRef.current?.();
    };
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      notify();
      return;
    }
    video.addEventListener("canplay", notify);
    return () => {
      video.removeEventListener("canplay", notify);
    };
  }, [mode, url]);

  return (
    <div
      data-vp-preview-layer=""
      data-vp-preview-mode={mode}
      aria-hidden={!visible}
      style={{
        position: "absolute",
        inset: 0,
        opacity: visible ? 1 : 0,
        transition: opacityTransition,
      }}
    >
      {poster ? (
        <img
          alt=""
          src={poster}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      <video
        ref={videoRef}
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: mediaReady ? 1 : 0,
          transition: opacityTransition,
        }}
        src={url}
        aria-label={visible ? "Video preview" : undefined}
        muted
        playsInline
        loop={mode === "loop"}
        preload="auto"
      />
    </div>
  );
}

export type PlayerPreviewCrossfadeProps = {
  url: string;
  mode: PlayerPreviewMode;
  crossfadeDurationMs?: number;
};

type PreviewSlot = "a" | "b";

function otherSlot(slot: PreviewSlot): PreviewSlot {
  return slot === "a" ? "b" : "a";
}

function posterFor(videos: Player.Video[], url: string | null) {
  if (!url) return undefined;
  return videos.find((video) => video.url === url)?.poster;
}

function PlayerPreviewCrossfade({
  url,
  mode,
  crossfadeDurationMs = PLAYER_PREVIEW_CROSSFADE_MS,
}: PlayerPreviewCrossfadeProps) {
  const {
    state: { videos, activeIndex },
  } = usePlayerContext();
  const nextUrl =
    videos[activeIndex + 1]?.url ?? videos[activeIndex - 1]?.url ?? null;

  const [slots, setSlots] = useState<{ a: string | null; b: string | null }>({
    a: url,
    b: null,
  });
  const [front, setFront] = useState<PreviewSlot>("a");
  const [ready, setReady] = useState({ a: false, b: false });
  const [revealBack, setRevealBack] = useState(false);

  const back = otherSlot(front);
  const frontUrl = slots[front];
  const backUrl = slots[back];
  const backPoster = posterFor(videos, backUrl);

  useEffect(() => {
    if (!frontUrl || url === frontUrl || revealBack || backUrl === url) {
      return;
    }
    setSlots((current) => ({ ...current, [back]: url }));
    setReady((current) => ({ ...current, [back]: false }));
  }, [back, backUrl, frontUrl, revealBack, url]);

  useEffect(() => {
    if (!frontUrl || url === frontUrl || revealBack || backUrl !== url) {
      return;
    }
    if (ready[back] || backPoster) {
      setRevealBack(true);
    }
  }, [back, backPoster, backUrl, frontUrl, ready, revealBack, url]);

  useEffect(() => {
    if (!revealBack || !backUrl) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      const promoted = back;
      const retired = front;
      const promotedUrl = backUrl;
      const upcoming =
        nextUrl && nextUrl !== promotedUrl ? nextUrl : null;
      setFront(promoted);
      setRevealBack(false);
      setSlots((current) => ({ ...current, [retired]: upcoming }));
      setReady((current) => ({ ...current, [retired]: false }));
    }, crossfadeDurationMs);
    return () => window.clearTimeout(timeoutId);
  }, [back, backUrl, crossfadeDurationMs, front, nextUrl, revealBack]);

  useEffect(() => {
    if (!frontUrl || url !== frontUrl || revealBack || !ready[front]) {
      return;
    }
    if (!nextUrl || nextUrl === frontUrl || backUrl === nextUrl) {
      return;
    }
    setSlots((current) => ({ ...current, [back]: nextUrl }));
    setReady((current) => ({ ...current, [back]: false }));
  }, [back, backUrl, front, frontUrl, nextUrl, ready, revealBack, url]);

  const markReady = (slot: PreviewSlot) => {
    setReady((current) =>
      current[slot] ? current : { ...current, [slot]: true },
    );
  };

  return (
    <div
      data-vp-preview=""
      data-vp-preview-crossfade=""
      className="relative size-full overflow-hidden"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {slots.a ? (
        <PlayerPreviewVideoLayer
          key="preview-slot-a"
          url={slots.a}
          poster={posterFor(videos, slots.a)}
          mode={mode}
          visible={front === "a" ? !revealBack : revealBack && back === "a"}
          playing={
            mode === "loop" &&
            (front === "a" ? !revealBack : revealBack && back === "a")
          }
          crossfadeDurationMs={crossfadeDurationMs}
          onCanPlay={() => markReady("a")}
        />
      ) : null}
      {slots.b ? (
        <PlayerPreviewVideoLayer
          key="preview-slot-b"
          url={slots.b}
          poster={posterFor(videos, slots.b)}
          mode={mode}
          visible={front === "b" ? !revealBack : revealBack && back === "b"}
          playing={
            mode === "loop" &&
            (front === "b" ? !revealBack : revealBack && back === "b")
          }
          crossfadeDurationMs={crossfadeDurationMs}
          onCanPlay={() => markReady("b")}
        />
      ) : null}
    </div>
  );
}

function PlayerPreviewLoop({ url }: PlayerPreviewUrlProps) {
  return (
    <video
      data-vp-preview=""
      data-vp-preview-mode="loop"
      className="block size-full object-cover"
      src={url}
      aria-label="Video preview"
      autoPlay
      muted
      playsInline
      loop
      preload="metadata"
    />
  );
}

function PlayerPreviewFirstFrame({ url }: PlayerPreviewUrlProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const syncFirstFrame = () => {
      pauseOnFirstFrame(video);
    };

    video.addEventListener("loadeddata", syncFirstFrame);
    video.addEventListener("seeked", syncFirstFrame);

    syncFirstFrame();

    return () => {
      video.removeEventListener("loadeddata", syncFirstFrame);
      video.removeEventListener("seeked", syncFirstFrame);
    };
  }, [url]);

  return (
    <video
      ref={videoRef}
      data-vp-preview=""
      data-vp-preview-mode="first-frame"
      className="block size-full object-cover"
      src={url}
      aria-label="Video preview"
      muted
      playsInline
      preload="metadata"
    />
  );
}

function useActivePreviewUrl() {
  const {
    state: { activeVideo },
  } = usePlayerContext();
  return activeVideo?.url;
}

export type PlayerPreviewActiveProps = {
  crossfadeDurationMs?: number;
};

function PlayerPreviewActive({
  crossfadeDurationMs,
}: PlayerPreviewActiveProps = {}) {
  const url = useActivePreviewUrl();

  if (!url) {
    return null;
  }

  return (
    <PlayerPreviewCrossfade
      url={url}
      mode="loop"
      crossfadeDurationMs={crossfadeDurationMs}
    />
  );
}

export type PlayerPreviewInactiveProps = PlayerPreviewActiveProps;

function PlayerPreviewInactive({
  crossfadeDurationMs,
}: PlayerPreviewInactiveProps = {}) {
  const url = useActivePreviewUrl();

  if (!url) {
    return null;
  }

  return (
    <PlayerPreviewCrossfade
      url={url}
      mode="first-frame"
      crossfadeDurationMs={crossfadeDurationMs}
    />
  );
}

export const PlayerPreview = {
  Active: PlayerPreviewActive,
  Inactive: PlayerPreviewInactive,
  Loop: PlayerPreviewLoop,
  FirstFrame: PlayerPreviewFirstFrame,
};
