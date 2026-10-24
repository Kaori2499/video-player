import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { type EasingConfig, useDialKitController } from "dialkit";

export const PLAYER_SHADOW_DIAL_NAME = "Player shadow";

const HORIZONTAL_OUTER_GRADIENT_CURVE: EasingConfig = {
  type: "easing",
  duration: 1,
  ease: [0, 0, 0.51, 0.91],
};

const VERTICAL_OUTER_GRADIENT_CURVE: EasingConfig = {
  type: "easing",
  duration: 1,
  ease: [0, 0, 0.58, 1],
};

const HORIZONTAL_AXIS = {
  innerThinRem: [0.125, 0.125, 2, 0.0625] as [number, number, number, number],
  outerSizeRem: [71, 8, 120, 1] as [number, number, number, number],
  wideExcessShare: [0.25, 0, 1, 0.05] as [number, number, number, number],
  outerGradientCurve: HORIZONTAL_OUTER_GRADIENT_CURVE,
};

export const PLAYER_SHADOW_DIAL_CONFIG = {
  edges: {
    left: true,
    right: true,
    top: false,
    bottom: true,
  },
  horizontal: HORIZONTAL_AXIS,
  vertical: {
    innerThinRem: [0.125, 0.125, 2, 0.0625] as [number, number, number, number],
    outerSizeRem: [17, 8, 120, 1] as [number, number, number, number],
    wideExcessShare: [0, 0, 1, 0.05] as [number, number, number, number],
    outerGradientCurve: VERTICAL_OUTER_GRADIENT_CURVE,
  },
  rightOnlyAbove2xl: true,
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_SHADOW_DIAL_OPTIONS = {
  id: "playground-player-shadow",
  persist: true,
} as const;

export function usePlayerShadowDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_SHADOW_DIAL_NAME,
    resolveDialConfig(PLAYER_SHADOW_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_SHADOW_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerShadowDialValues = ReturnType<typeof usePlayerShadowDialKit>;
