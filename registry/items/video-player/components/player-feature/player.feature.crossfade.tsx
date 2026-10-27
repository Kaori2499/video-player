import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import { usePlayerContext } from "./player.context";
import type { Player } from "./player.types";

export const PLAYER_FEATURE_CROSSFADE_DEFAULTS = {
  enabled: true,
  exitDurationMs: 320,
  enterDurationMs: 320,
  maxBlurPx: 8,
} as const;

export type PlayerFeatureCrossfadeConfig = {
  enabled?: boolean;
  exitDurationMs?: number;
  enterDurationMs?: number;
  /** @deprecated Use `enterDurationMs` */
  durationMs?: number;
  maxBlurPx?: number;
};

export type PlayerFeatureCrossfadePhase = "idle" | "exiting" | "entering";

export type PlayerFeatureCrossfadeStack = "solo" | "incoming" | "outgoing";

export type PlayerFeatureCrossfadeLayer = {
  key: string;
  video: Player.Video;
  visible: boolean;
  stack: PlayerFeatureCrossfadeStack;
  animationDurationMs: number;
};

export type PlayerFeatureCrossfadeTransition = {
  enabled: boolean;
  exitDurationMs: number;
  enterDurationMs: number;
  maxBlurPx: number;
  phase: PlayerFeatureCrossfadePhase;
  isAnimating: boolean;
  layers: PlayerFeatureCrossfadeLayer[];
};

export function playerFeatureCrossfadeLayerStyle(
  visible: boolean,
  durationMs: number,
  maxBlurPx: number,
): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : `blur(${maxBlurPx}px)`,
    transition:
      durationMs > 0
        ? `opacity ${durationMs}ms cubic-bezier(0, 0, 0.58, 1), filter ${durationMs}ms cubic-bezier(0, 0, 0.58, 1)`
        : "none",
  };
}

function videoKey(video: Player.Video) {
  return video.url;
}

function videosMatch(
  a: Player.Video | null | undefined,
  b: Player.Video | null | undefined,
) {
  if (!a || !b) {
    return false;
  }
  return videoKey(a) === videoKey(b);
}

function resolveExitDurationMs(config: PlayerFeatureCrossfadeConfig) {
  return (
    config.exitDurationMs ?? PLAYER_FEATURE_CROSSFADE_DEFAULTS.exitDurationMs
  );
}

function resolveEnterDurationMs(config: PlayerFeatureCrossfadeConfig) {
  return (
    config.enterDurationMs ??
    config.durationMs ??
    PLAYER_FEATURE_CROSSFADE_DEFAULTS.enterDurationMs
  );
}

export function usePlayerFeatureCrossfade(
  config: PlayerFeatureCrossfadeConfig = {},
): PlayerFeatureCrossfadeTransition {
  const {
    state: { activeVideo },
  } = usePlayerContext();

  const enabled = config.enabled ?? PLAYER_FEATURE_CROSSFADE_DEFAULTS.enabled;
  const exitDurationMs = resolveExitDurationMs(config);
  const enterDurationMs = resolveEnterDurationMs(config);
  const maxBlurPx =
    config.maxBlurPx ?? PLAYER_FEATURE_CROSSFADE_DEFAULTS.maxBlurPx;

  const [displayed, setDisplayed] = useState<Player.Video | null>(
    activeVideo ?? null,
  );
  const [phase, setPhase] = useState<PlayerFeatureCrossfadePhase>("idle");
  const [outgoing, setOutgoing] = useState<Player.Video | null>(null);
  const [incoming, setIncoming] = useState<Player.Video | null>(null);
  const [outgoingVisible, setOutgoingVisible] = useState(true);
  const [incomingVisible, setIncomingVisible] = useState(false);

  const beginExit = (from: Player.Video, to: Player.Video) => {
    setOutgoing(from);
    setIncoming(to);
    setOutgoingVisible(true);
    setIncomingVisible(false);
    setPhase("exiting");
  };

  useLayoutEffect(() => {
    if (phase !== "exiting" || !outgoing) {
      return;
    }

    setOutgoingVisible(true);
    let frameA = 0;
    let frameB = 0;
    frameA = requestAnimationFrame(() => {
      frameB = requestAnimationFrame(() => {
        setOutgoingVisible(false);
      });
    });

    return () => {
      cancelAnimationFrame(frameA);
      cancelAnimationFrame(frameB);
    };
  }, [outgoing, phase]);

  useLayoutEffect(() => {
    if (phase !== "entering" || !incoming) {
      return;
    }

    setIncomingVisible(false);
    let frameA = 0;
    let frameB = 0;
    frameA = requestAnimationFrame(() => {
      frameB = requestAnimationFrame(() => {
        setIncomingVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(frameA);
      cancelAnimationFrame(frameB);
    };
  }, [incoming, phase]);

  useEffect(() => {
    if (!activeVideo) {
      setDisplayed(null);
      setOutgoing(null);
      setIncoming(null);
      setPhase("idle");
      setOutgoingVisible(true);
      setIncomingVisible(false);
      return;
    }

    if (!displayed) {
      setDisplayed(activeVideo);
      return;
    }

    if (phase === "idle" && !videosMatch(displayed, activeVideo)) {
      beginExit(displayed, activeVideo);
      return;
    }

    if (
      (phase === "exiting" || phase === "entering") &&
      incoming &&
      !videosMatch(incoming, activeVideo)
    ) {
      setIncoming(activeVideo);
    }
  }, [activeVideo, displayed, incoming, phase]);

  useEffect(() => {
    if (phase !== "exiting" || !outgoing || !incoming) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOutgoing(null);
      setOutgoingVisible(true);
      setIncomingVisible(false);
      setPhase("entering");
    }, exitDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [exitDurationMs, incoming, outgoing, phase]);

  useEffect(() => {
    if (phase !== "entering" || !incoming) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const settled = incoming;
      setDisplayed(settled);
      setIncoming(null);
      setIncomingVisible(false);

      if (activeVideo && !videosMatch(settled, activeVideo)) {
        beginExit(settled, activeVideo);
        return;
      }

      setPhase("idle");
    }, enterDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [activeVideo, enterDurationMs, incoming, phase]);

  const baseTransition = {
    exitDurationMs,
    enterDurationMs,
    maxBlurPx,
  };

  if (!enabled) {
    return {
      enabled: false,
      ...baseTransition,
      phase: "idle",
      isAnimating: false,
      layers: activeVideo
        ? [
            {
              key: videoKey(activeVideo),
              video: activeVideo,
              visible: true,
              stack: "solo",
              animationDurationMs: 0,
            },
          ]
        : [],
    };
  }

  const isAnimating = phase !== "idle";

  if (phase === "exiting" && outgoing) {
    return {
      enabled: true,
      ...baseTransition,
      phase,
      isAnimating,
      layers: [
        {
          key: videoKey(outgoing),
          video: outgoing,
          visible: outgoingVisible,
          stack: "outgoing",
          animationDurationMs: exitDurationMs,
        },
      ],
    };
  }

  if (phase === "entering" && incoming) {
    return {
      enabled: true,
      ...baseTransition,
      phase,
      isAnimating,
      layers: [
        {
          key: videoKey(incoming),
          video: incoming,
          visible: incomingVisible,
          stack: "incoming",
          animationDurationMs: enterDurationMs,
        },
      ],
    };
  }

  const solo = displayed ?? activeVideo;

  return {
    enabled: true,
    ...baseTransition,
    phase: "idle",
    isAnimating: false,
    layers: solo
      ? [
          {
            key: videoKey(solo),
            video: solo,
            visible: true,
            stack: "solo",
            animationDurationMs: 0,
          },
        ]
      : [],
  };
}
