import {
  PlayerShadow,
  type PlayerShadowGradientEase,
} from "@component-template/react";
import type { PlayerShadowDialValues } from "./dialkit";

function outerGradientEaseFromDial(
  curve: PlayerShadowDialValues["outerGradientCurve"],
): PlayerShadowGradientEase | undefined {
  if (curve.type !== "easing") return undefined;
  return curve.ease;
}

export function PlayerShadowLayers({ values }: { values: PlayerShadowDialValues }) {
  const outerGradientEase = outerGradientEaseFromDial(values.outerGradientCurve);

  return (
    <PlayerShadow.Root
      innerThinRem={values.innerThinRem}
      outerSizeRem={values.outerSizeRem}
      wideExcessShare={values.wideExcessShare}
      outerGradientEase={outerGradientEase}
    >
      {values.edges.left ? <PlayerShadow.Left /> : null}
      {values.edges.right ? (
        <PlayerShadow.Right
          minViewport={values.rightOnlyAbove2xl ? "2xl" : undefined}
        />
      ) : null}
      {values.edges.top ? <PlayerShadow.Top /> : null}
      {values.edges.bottom ? <PlayerShadow.Bottom /> : null}
    </PlayerShadow.Root>
  );
}
