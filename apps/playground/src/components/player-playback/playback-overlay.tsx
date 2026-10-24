import { PlayerLayout, VideoPlayer } from "@component-template/react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useCarouselCatalog } from "../../carousel/useCarouselCatalog";
import { carouselEntriesToPlaybackAssets } from "./assets";
import { PlaybackPauseOnEnded } from "./playback-pause-on-ended";
import {
  playbackOverlayEaseFromDial,
  type PlayerPlaybackDialValues,
} from "./dialkit";

/** Limeplay default is 2000ms; overlay feels snappier with a shorter idle hide. */
const PLAYBACK_CONTROLS_HIDE_DELAY_MS = 900;

export function PlayerPlaybackOverlay({
  open,
  onClose,
  motion,
}: {
  open: boolean;
  onClose: () => void;
  motion: PlayerPlaybackDialValues;
}) {
  const { entries, status } = useCarouselCatalog();
  const { state } = PlayerLayout.useContext();

  const [present, setPresent] = useState(false);
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const assets = useMemo(
    () => carouselEntriesToPlaybackAssets(entries),
    [entries],
  );

  const sourceKey = useMemo(
    () => assets.map((asset) => asset.id ?? asset.src).join("|"),
    [assets],
  );

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }

    if (!present) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setPresent(false),
      motion.durationMs,
    );
    return () => window.clearTimeout(timeoutId);
  }, [motion.durationMs, open, present]);

  useLayoutEffect(() => {
    if (!present) {
      return;
    }

    if (open) {
      setActive(false);
      let frameA = 0;
      let frameB = 0;
      frameA = requestAnimationFrame(() => {
        frameB = requestAnimationFrame(() => setActive(true));
      });

      return () => {
        cancelAnimationFrame(frameA);
        cancelAnimationFrame(frameB);
      };
    }

    let exitFrame = 0;
    exitFrame = requestAnimationFrame(() => setActive(false));

    return () => {
      cancelAnimationFrame(exitFrame);
    };
  }, [open, present]);

  useEffect(() => {
    if (!present) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, present]);

  if (!present || status !== "ready" || assets.length === 0) {
    return null;
  }

  const activeIndex = Math.min(
    Math.max(state.activeIndex, 0),
    assets.length - 1,
  );

  const ease = playbackOverlayEaseFromDial(motion.curve);
  const durationMs = motion.durationMs;
  const scaleFrom = motion.scaleFrom;
  const scaleMotion = motion.enabled && !reduceMotion;

  const motionEnabled = present && (active || !open);
  const motionTransition = motionEnabled
    ? scaleMotion
      ? `opacity ${durationMs}ms ${ease}, transform ${durationMs}ms ${ease}`
      : `opacity ${durationMs}ms ${ease}`
    : "none";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm motion-reduce:transition-none"
      role="dialog"
      aria-modal="true"
      aria-label="Video playback"
      data-testid="player-playback-overlay"
      style={{
        opacity: active ? 1 : 0,
        transition: motionTransition,
      }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close playback"
        onClick={onClose}
      />
      <div
        className="relative z-[1] w-full max-w-6xl motion-reduce:transform-none"
        style={{
          opacity: active ? 1 : 0,
          transform: scaleMotion
            ? active
              ? "scale(1)"
              : `scale(${scaleFrom})`
            : undefined,
          transition: motionTransition,
        }}
      >
        <div className="aspect-video w-full min-h-0 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10">
          {present ? (
            <VideoPlayer
              key={`playback-${activeIndex}-${sourceKey}`}
              className="size-full"
              layout="fill"
              theme="dark"
              source={assets}
              initialIndex={activeIndex}
              sourceKey={sourceKey}
              loading={{ advanceOnEnded: false }}
              controlsHideDelay={PLAYBACK_CONTROLS_HIDE_DELAY_MS}
              mediaProps={{ autoPlay: true, playsInline: true }}
            >
              <PlaybackPauseOnEnded />
            </VideoPlayer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
