import { useState } from "react";
import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { useDialKitController } from "dialkit";

export const PLAYER_PAGE_ENTER_DIAL_NAME = "Player page enter";

export const PLAYER_PAGE_ENTER_DIAL_CONFIG = {
  enabled: true,
  staggerMs: [80, 0, 500, 10] as [number, number, number, number],
  durationMs: [500, 0, 2000, 10] as [number, number, number, number],
  maxBlurPx: [8, 0, 40, 0.5] as [number, number, number, number],
  translateYRem: [0.5, 0, 4, 0.0625] as [number, number, number, number],
  carouselSlides: {
    enabled: true,
    staggerMs: [40, 0, 500, 10] as [number, number, number, number],
    durationMs: [500, 0, 2000, 10] as [number, number, number, number],
    maxBlurPx: [8, 0, 40, 0.5] as [number, number, number, number],
    translateYRem: [0.5, 0, 4, 0.0625] as [number, number, number, number],
  },
  replay: { type: "action", label: "Replay enter" },
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_PAGE_ENTER_DIAL_OPTIONS = {
  id: "playground-player-page-enter",
  persist: true,
} as const;

export function usePlayerPageEnterDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
) {
  const [epoch, setEpoch] = useState(0);

  const dial = useDialKitController(
    PLAYER_PAGE_ENTER_DIAL_NAME,
    resolveDialConfig(PLAYER_PAGE_ENTER_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_PAGE_ENTER_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "replay") {
          setEpoch((value) => value + 1);
        }
        if (path === "reset") {
          dial.resetValues();
          setEpoch((value) => value + 1);
        }
      },
    },
  );

  return { values: dial.values, epoch };
}

export type PlayerPageEnterDialValues = ReturnType<
  typeof usePlayerPageEnterDialKit
>["values"];
