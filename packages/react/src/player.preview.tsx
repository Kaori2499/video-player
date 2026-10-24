import { useEffect, useRef } from "react";
import { usePlayerContext } from "./player.context";

export type PlayerPreviewUrlProps = {
  url: string;
};

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

function PlayerPreviewLoop({ url }: PlayerPreviewUrlProps) {
  return (
    <video
      data-vp-preview=""
      data-vp-preview-mode="loop"
      className="block h-full w-full object-cover"
      src={url}
      aria-label="Video preview"
      autoPlay
      muted
      playsInline
      loop
      preload="auto"
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
      className="block h-full w-full object-cover"
      src={url}
      aria-label="Video preview"
      muted
      playsInline
      preload="auto"
    />
  );
}

function useActivePreviewUrl() {
  const {
    state: { activeVideo },
  } = usePlayerContext();
  return activeVideo?.url;
}

function PlayerPreviewActive() {
  const url = useActivePreviewUrl();

  if (!url) {
    return null;
  }

  return <PlayerPreviewLoop url={url} />;
}

function PlayerPreviewInactive() {
  const url = useActivePreviewUrl();

  if (!url) {
    return null;
  }

  return <PlayerPreviewFirstFrame url={url} />;
}

export const PlayerPreview = {
  Active: PlayerPreviewActive,
  Inactive: PlayerPreviewInactive,
  Loop: PlayerPreviewLoop,
  FirstFrame: PlayerPreviewFirstFrame,
};
