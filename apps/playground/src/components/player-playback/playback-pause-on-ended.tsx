import { usePlaybackStore } from "@/hooks/limeplay/use-playback";
import { useEffect, useRef } from "react";

/** Inside `VideoPlayer` / `MediaProvider`: pause when the active asset ends. */
export function PlaybackPauseOnEnded() {
  const status = usePlaybackStore((state) => state.status);
  const pause = usePlaybackStore((state) => state.pause);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (prevStatusRef.current !== "ended" && status === "ended") {
      pause();
    }
    prevStatusRef.current = status;
  }, [pause, status]);

  return null;
}
