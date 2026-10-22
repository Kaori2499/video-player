import { useEffect, useRef } from "react";
import { usePlayerContext } from "./player.context";

export type PlayerPreviewProps = {
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

type PlayerPreviewVideoProps = PlayerPreviewProps & {
  inactive?: boolean;
};

function PlayerPreviewVideo({ url, inactive = false }: PlayerPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!inactive) {
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
  }, [inactive, url]);

  return (
    <video
      ref={videoRef}
      data-vp-preview=""
      data-vp-preview-inactive={inactive ? "" : undefined}
      className="block h-full w-full object-cover"
      src={url}
      aria-label="Video preview"
      autoPlay={!inactive}
      muted
      playsInline
      loop={!inactive}
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

  return <PlayerPreviewVideo url={url} />;
}

function PlayerPreviewInactive() {
  const url = useActivePreviewUrl();

  if (!url) {
    return null;
  }

  return <PlayerPreviewVideo url={url} inactive />;
}

export const PlayerPreview = Object.assign(PlayerPreviewVideo, {
  Active: PlayerPreviewActive,
  Inactive: PlayerPreviewInactive,
});
