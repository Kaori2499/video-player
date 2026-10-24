import {
  PlayerShadow,
  type PlayerShadowGradientEase,
} from "@component-template/react";
import type { PlayerShadowDialValues } from "./dialkit";

function outerGradientEaseFromDial(
  curve: { type: string; ease?: readonly number[] },
): PlayerShadowGradientEase | undefined {
  if (curve.type !== "easing" || !curve.ease) return undefined;
  return curve.ease as PlayerShadowGradientEase;
}

export function PlayerShadowLayers({ values }: { values: PlayerShadowDialValues }) {
  return (
    <PlayerShadow.Root
      horizontal={{
        innerThinRem: values.horizontal.innerThinRem,
        outerSizeRem: values.horizontal.outerSizeRem,
        wideExcessShare: values.horizontal.wideExcessShare,
        outerGradientEase: outerGradientEaseFromDial(
          values.horizontal.outerGradientCurve,
        ),
      }}
      vertical={{
        innerThinRem: values.vertical.innerThinRem,
        outerSizeRem: values.vertical.outerSizeRem,
        wideExcessShare: values.vertical.wideExcessShare,
        outerGradientEase: outerGradientEaseFromDial(
          values.vertical.outerGradientCurve,
        ),
      }}
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
