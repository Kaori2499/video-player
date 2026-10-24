import { PlayerBlur, type PlayerBlurStrength } from "@component-template/react";
import type { PlayerBlurDialValues } from "./dialkit";

const BLUR_BY_STRENGTH = {
  sm: PlayerBlur.Sm,
  md: PlayerBlur.Md,
  lg: PlayerBlur.Lg,
} as const satisfies Record<PlayerBlurStrength, typeof PlayerBlur.Sm>;

export function PlayerBlurLayer({ values }: { values: PlayerBlurDialValues }) {
  if (!values.enabled) {
    return null;
  }

  const Blur = BLUR_BY_STRENGTH[values.strength as PlayerBlurStrength];
  return <Blur />;
}
