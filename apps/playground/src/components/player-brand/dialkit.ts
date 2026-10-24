import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { useDialKitController } from "dialkit";

export const PLAYER_BRAND_DIAL_NAME = "Player brand";

export const PLAYER_BRAND_DIAL_CONFIG = {
  iconSizeRem: [1.25, 0.5, 3, 0.0625] as [number, number, number, number],
  separatorSizeRem: [1.6875, 0.25, 3, 0.0625] as [number, number, number, number],
  textSizeRem: [0.75, 0.625, 2.5, 0.0625] as [number, number, number, number],
  gapRem: [0.625, 0, 2, 0.0625] as [number, number, number, number],
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_BRAND_DIAL_OPTIONS = {
  id: "playground-player-brand",
  persist: true,
} as const;

export function usePlayerBrandDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_BRAND_DIAL_NAME,
    resolveDialConfig(PLAYER_BRAND_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_BRAND_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerBrandDialValues = ReturnType<typeof usePlayerBrandDialKit>;
