import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { type EasingConfig, useDialKitController } from "dialkit";

export const PLAYER_CAROUSEL_DIAL_NAME = "Player carousel";

/** DialKit easing UI duration slider is in seconds and caps at 2s. */
const DIALKIT_EASING_DURATION_MAX_S = 2;
const DIALKIT_EASING_DURATION_MIN_S = 0.1;

function msToDialKitEasingDurationSeconds(ms: number) {
  const seconds = ms / 1000;
  const clamped = Math.min(
    DIALKIT_EASING_DURATION_MAX_S,
    Math.max(DIALKIT_EASING_DURATION_MIN_S, seconds),
  );
  const step = 0.05;
  return Math.round(clamped / step) * step;
}

const SLIDE_TRANSITION_CURVE: EasingConfig = {
  type: "easing",
  duration: msToDialKitEasingDurationSeconds(320),
  ease: [0.4, 0.7, 0.35, 0.86],
};

export const PLAYER_CAROUSEL_DIAL_CONFIG = {
  gapRem: [2, 0, 2, 0.0625] as [number, number, number, number],
  slideWidthRem: [8.75, 8, 32, 0.25] as [number, number, number, number],
  slideRadiusRem: [0.5, 0, 2, 0.0625] as [number, number, number, number],
  paddingTopRem: [1.375, 0, 3, 0.0625] as [number, number, number, number],
  paddingBottomRem: [3, 0, 3, 0.0625] as [number, number, number, number],
  captionTextSizeRem: [0.75, 0.625, 1.5, 0.0625] as [
    number,
    number,
    number,
    number,
  ],
  navButtonBg: {
    type: "color" as const,
    default: "#6a6a6a26",
  },
  navButtonHoverBg: {
    type: "color" as const,
    default: "#a6a6a640",
  },
  slideTransitionDurationMs: [320, 50, 8000, 10] as [
    number,
    number,
    number,
    number,
  ],
  slideTransitionCurve: SLIDE_TRANSITION_CURVE,
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_CAROUSEL_DIAL_OPTIONS = {
  id: "playground-player-carousel",
  persist: true,
} as const;

export function usePlayerCarouselDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_CAROUSEL_DIAL_NAME,
    resolveDialConfig(PLAYER_CAROUSEL_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_CAROUSEL_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerCarouselDialValues = ReturnType<
  typeof usePlayerCarouselDialKit
>;
