import { useCallback, useEffect, useRef, useState } from "react";
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
  crossfadeDurationMs: number;
  onCanPlay?: () => void;
};

function PlayerPreviewVideoLayer({
  url,
  mode,
  visible,
  crossfadeDurationMs,
  onCanPlay,
}: PlayerPreviewVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (!onCanPlay) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const notify = () => {
      onCanPlay();
    };
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      notify();
      return;
    }
    video.addEventListener("canplay", notify);
    video.addEventListener("loadeddata", notify);
    return () => {
      video.removeEventListener("canplay", notify);
      video.removeEventListener("loadeddata", notify);
    };
  }, [onCanPlay, url]);

  return (
    <video
      ref={videoRef}
      data-vp-preview-layer=""
      data-vp-preview-mode={mode}
      className="pointer-events-none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: visible ? 1 : 0,
        transition:
          crossfadeDurationMs > 0
            ? `opacity ${crossfadeDurationMs}ms cubic-bezier(0, 0, 0.58, 1)`
            : "none",
      }}
      src={url}
      aria-hidden={!visible}
      aria-label={visible ? "Video preview" : undefined}
      autoPlay={mode === "loop"}
      muted
      playsInline
      loop={mode === "loop"}
      preload="metadata"
    />
  );
}

export type PlayerPreviewCrossfadeProps = {
  url: string;
  mode: PlayerPreviewMode;
  crossfadeDurationMs?: number;
};

function PlayerPreviewCrossfade({
  url,
  mode,
  crossfadeDurationMs = PLAYER_PREVIEW_CROSSFADE_MS,
}: PlayerPreviewCrossfadeProps) {
  const [incoming, setIncoming] = useState(url);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const [fadeToIncoming, setFadeToIncoming] = useState(true);

  useEffect(() => {
    if (url === incoming) {
      return;
    }
    setOutgoing(incoming);
    setIncoming(url);
    setIncomingReady(false);
    setFadeToIncoming(false);
  }, [incoming, url]);

  const handleIncomingReady = useCallback(() => {
    setIncomingReady(true);
    requestAnimationFrame(() => {
      setFadeToIncoming(true);
    });
  }, []);

  useEffect(() => {
    if (!outgoing || !fadeToIncoming || !incomingReady) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setOutgoing(null);
    }, crossfadeDurationMs);
    return () => window.clearTimeout(timeoutId);
  }, [crossfadeDurationMs, fadeToIncoming, incoming, incomingReady, outgoing]);

  const incomingVisible =
    outgoing === null
      ? incomingReady
      : fadeToIncoming && incomingReady;
  const outgoingVisible = outgoing !== null && !(fadeToIncoming && incomingReady);

  return (
    <div
      data-vp-preview=""
      data-vp-preview-crossfade=""
      className="relative size-full overflow-hidden"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {outgoing ? (
        <PlayerPreviewVideoLayer
          key={outgoing}
          url={outgoing}
          mode={mode}
          visible={outgoingVisible}
          crossfadeDurationMs={crossfadeDurationMs}
        />
      ) : null}
      <PlayerPreviewVideoLayer
        key={incoming}
        url={incoming}
        mode={mode}
        visible={incomingVisible}
        crossfadeDurationMs={crossfadeDurationMs}
        onCanPlay={handleIncomingReady}
      />
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
