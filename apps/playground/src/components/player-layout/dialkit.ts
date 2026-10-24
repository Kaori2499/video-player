import { cn } from "@/lib/utils";
import {
  dialKitPanelOptions,
  type PlaygroundDialKitMountOptions,
  resolveDialConfig,
} from "../dialkit/playground-dialkit";
import { useDialKitController } from "dialkit";
import type { CSSProperties } from "react";

export const PLAYER_LAYOUT_DIAL_NAME = "Player layout";

export const PLAYER_LAYOUT_MAX_WIDTH_OPTIONS = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
] as const;

export type PlayerLayoutMaxWidth = (typeof PLAYER_LAYOUT_MAX_WIDTH_OPTIONS)[number];

function maxWidthSelect(defaultValue: PlayerLayoutMaxWidth) {
  return {
    type: "select" as const,
    options: [...PLAYER_LAYOUT_MAX_WIDTH_OPTIONS],
    default: defaultValue,
  };
}

const MAX_WIDTH_CLASS_NAME: Record<PlayerLayoutMaxWidth, string | undefined> = {
  none: undefined,
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const regionBase = {
  maxHeightRem: [0, 0, 48, 0.25] as [number, number, number, number],
  paddingXRem: [0, 0, 6, 0.125] as [number, number, number, number],
  paddingYRem: [0, 0, 6, 0.125] as [number, number, number, number],
};

export const PLAYER_LAYOUT_DIAL_CONFIG = {
  root: {
    heightDvh: [100, 40, 100, 1] as [number, number, number, number],
    maxWidth: maxWidthSelect("none"),
    paddingXRem: [1.5, 0, 6, 0.125] as [number, number, number, number],
    paddingYRem: [0, 0, 6, 0.125] as [number, number, number, number],
  },
  header: {
    ...regionBase,
    maxWidth: maxWidthSelect("5xl"),
    paddingYRem: [2.75, 0, 6, 0.125] as [number, number, number, number],
  },
  content: {
    ...regionBase,
    maxWidth: maxWidthSelect("5xl"),
  },
  footer: {
    ...regionBase,
    maxWidth: maxWidthSelect("none"),
    paddingYRem: [0.5, 0, 6, 0.125] as [number, number, number, number],
  },
  showRegionBorders: false,
  previewCrossfadeDurationMs: [320, 0, 3000, 10] as [
    number,
    number,
    number,
    number,
  ],
  reset: { type: "action", label: "Reset to defaults" },
};

export const PLAYER_LAYOUT_DIAL_OPTIONS = {
  id: "playground-player-layout",
  persist: true,
} as const;

export type PlayerLayoutPaddingDial = {
  paddingXRem: number;
  paddingYRem: number;
};

export type PlayerLayoutRegionDial = PlayerLayoutPaddingDial & {
  maxHeightRem: number;
  maxWidth: string;
};

export type PlayerLayoutDialValues = {
  root: {
    heightDvh: number;
    maxWidth: string;
  } & PlayerLayoutPaddingDial;
  header: PlayerLayoutRegionDial;
  content: PlayerLayoutRegionDial;
  footer: PlayerLayoutRegionDial;
  showRegionBorders: boolean;
  previewCrossfadeDurationMs: number;
};

function remProp(value: number, property: keyof CSSProperties): CSSProperties {
  if (value <= 0) return {};
  return { [property]: `${value}rem` };
}

function paddingStyle(padding: PlayerLayoutPaddingDial): CSSProperties {
  return {
    ...remProp(padding.paddingXRem, "paddingInline"),
    ...remProp(padding.paddingYRem, "paddingBlock"),
  };
}

export function playerLayoutMaxWidthClassName(
  maxWidth: string,
): string | undefined {
  const token = maxWidth as PlayerLayoutMaxWidth;
  const maxClass = MAX_WIDTH_CLASS_NAME[token];
  if (!maxClass) return undefined;
  return cn("mx-auto w-full", maxClass);
}

export function playerLayoutRegionStyle(
  region: PlayerLayoutRegionDial,
): CSSProperties {
  return {
    ...remProp(region.maxHeightRem, "maxHeight"),
    ...paddingStyle(region),
  };
}

export function playerLayoutRootStyle(
  root: PlayerLayoutDialValues["root"],
): CSSProperties {
  return {
    height: `${root.heightDvh}dvh`,
    ...paddingStyle(root),
  };
}

export function usePlayerLayoutDialKit(
  mountOptions?: PlaygroundDialKitMountOptions,
): PlayerLayoutDialValues {
  const dial = useDialKitController(
    PLAYER_LAYOUT_DIAL_NAME,
    resolveDialConfig(PLAYER_LAYOUT_DIAL_CONFIG, mountOptions),
    {
      ...PLAYER_LAYOUT_DIAL_OPTIONS,
      ...dialKitPanelOptions(mountOptions),
      onAction(path) {
        if (path === "reset") dial.resetValues();
      },
    },
  );

  return dial.values;
}
