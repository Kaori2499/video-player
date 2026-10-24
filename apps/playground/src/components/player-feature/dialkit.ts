import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { useDialKitController } from "dialkit";

export const PLAYER_FEATURE_DIAL_NAME = "Player feature";

export const PLAYER_FEATURE_DIAL_CONFIG = {
  titleSizeRem: [3, 0.75, 5, 0.0625] as [number, number, number, number],
  descriptionSizeRem: [1, 0.625, 1.5, 0.0625] as [
    number,
    number,
    number,
    number,
  ],
  descriptionLineHeight: [1.6, 1.2, 2.2, 0.05] as [
    number,
    number,
    number,
    number,
  ],
  linksSizeRem: [0.875, 0.625, 1.25, 0.0625] as [number, number, number, number],
  dateSizeRem: [0.8125, 0.625, 1.25, 0.0625] as [number, number, number, number],
  durationSizeRem: [0.875, 0.625, 1.25, 0.0625] as [
    number,
    number,
    number,
    number,
  ],
  playSizeRem: [1, 0.625, 1.25, 0.0625] as [number, number, number, number],
  socialButtonSizeRem: [2, 1.5, 3.5, 0.0625] as [
    number,
    number,
    number,
    number,
  ],
  socialIconSizeRem: [0.9375, 0.75, 2, 0.0625] as [number, number, number, number],
  socialButtonBg: {
    type: "color" as const,
    default: "#6a6a6a40",
  },
  socialButtonHoverBg: {
    type: "color" as const,
    default: "#a6a6a640",
  },
  gapRem: [1.75, 0, 2, 0.0625] as [number, number, number, number],
  descriptionMaxWidthRem: [20.5, 16, 48, 0.5] as [number, number, number, number],
  plusLighter: true,
  crossfade: {
    enabled: true,
    exitDurationMs: [240, 0, 3000, 10] as [number, number, number, number],
    enterDurationMs: [320, 0, 3000, 10] as [number, number, number, number],
    maxBlurPx: [8, 0, 40, 0.5] as [number, number, number, number],
  },
  dateText: "Oct 29, 2024",
  durationText: "16 min",
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_FEATURE_DIAL_OPTIONS = {
  id: "playground-player-feature",
  persist: true,
} as const;

export function usePlayerFeatureDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_FEATURE_DIAL_NAME,
    resolveDialConfig(PLAYER_FEATURE_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_FEATURE_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerFeatureDialValues = ReturnType<typeof usePlayerFeatureDialKit>;
