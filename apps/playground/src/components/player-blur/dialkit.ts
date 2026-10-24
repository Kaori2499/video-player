import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { useDialKitController } from "dialkit";

export const PLAYER_BLUR_DIAL_NAME = "Player blur";

export const PLAYER_BLUR_DIAL_CONFIG = {
  enabled: true,
  strength: {
    type: "select" as const,
    options: ["sm", "md", "lg"],
  },
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_BLUR_DIAL_OPTIONS = {
  id: "playground-player-blur",
  persist: true,
} as const;

export function usePlayerBlurDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const dial = useDialKitController(
    PLAYER_BLUR_DIAL_NAME,
    resolveDialConfig(PLAYER_BLUR_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_BLUR_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}

export type PlayerBlurDialValues = ReturnType<typeof usePlayerBlurDialKit>;
