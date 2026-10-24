import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { type EasingConfig, useDialKitController } from "dialkit";

export const PLAYER_PLAYBACK_DIAL_NAME = "Player playback";

const OVERLAY_ENTER_CURVE: EasingConfig = {
  type: "easing",
  duration: 0.24,
  ease: [0.23, 1, 0.32, 1],
};

export const PLAYER_PLAYBACK_DIAL_CONFIG = {
  enabled: true,
  durationMs: [320, 100, 500, 10] as [number, number, number, number],
  scaleFrom: [0.8, 0.8, 1, 0.01] as [number, number, number, number],
  curve: OVERLAY_ENTER_CURVE,
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_PLAYBACK_DIAL_OPTIONS = {
  id: "playground-player-playback",
  persist: true,
} as const;

export function usePlayerPlaybackDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_PLAYBACK_DIAL_NAME,
    resolveDialConfig(PLAYER_PLAYBACK_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_PLAYBACK_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerPlaybackDialValues = ReturnType<typeof usePlayerPlaybackDialKit>;

export function playbackOverlayEaseFromDial(
  curve: PlayerPlaybackDialValues["curve"],
): string {
  if (curve.type !== "easing" || !curve.ease || curve.ease.length !== 4) {
    return "cubic-bezier(0.23, 1, 0.32, 1)";
  }
  const [x1, y1, x2, y2] = curve.ease;
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}
