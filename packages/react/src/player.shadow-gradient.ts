type ShadowGradientEdge = "left" | "right" | "top" | "bottom";

export type PlayerShadowGradientEase = readonly [
  number,
  number,
  number,
  number,
];

export const PLAYER_SHADOW_GRADIENT_EASE_DEFAULT: PlayerShadowGradientEase = [
  0, 0, 0.58, 1,
];

const GRADIENT_DIRECTION: Record<ShadowGradientEdge, string> = {
  left: "to right",
  right: "to left",
  top: "to bottom",
  bottom: "to top",
};

function cubicBezierComponent(
  t: number,
  p1: number,
  p2: number,
): number {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}

/** Maps normalized position along the rim (0 → 1) to eased progress (0 → 1). */
export function sampleShadowGradientEase(
  ease: PlayerShadowGradientEase,
  x: number,
): number {
  const clampedX = Math.max(0, Math.min(1, x));
  if (clampedX <= 0) return 0;
  if (clampedX >= 1) return 1;

  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const bx = cubicBezierComponent(mid, ease[0], ease[2]);
    if (bx < clampedX) lo = mid;
    else hi = mid;
  }

  const t = (lo + hi) / 2;
  return cubicBezierComponent(t, ease[1], ease[3]);
}

function formatAlpha(alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  if (clamped >= 0.9995) return "#000";
  if (clamped <= 0.0005) return "transparent";
  return `rgba(0,0,0,${clamped.toFixed(4)})`;
}

export function buildPlayerShadowOuterGradient(
  edge: ShadowGradientEdge,
  ease: PlayerShadowGradientEase = PLAYER_SHADOW_GRADIENT_EASE_DEFAULT,
  stopCount = 10,
): string {
  const direction = GRADIENT_DIRECTION[edge];
  const stops: string[] = [];

  for (let i = 0; i <= stopCount; i++) {
    const position = i / stopCount;
    const progress = sampleShadowGradientEase(ease, position);
    const alpha = 1 - progress;
    const pct = (position * 100).toFixed(2);
    stops.push(`${formatAlpha(alpha)} ${pct}%`);
  }

  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}
