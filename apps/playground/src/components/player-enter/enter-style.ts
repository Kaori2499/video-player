import type { CSSProperties } from "react";
import { PLAYER_ENTER_ROW_COUNT } from "./rows";

const ENTER_EASE = "cubic-bezier(0, 0, 0.58, 1)";

export function playerEnterRowStyle(
  visible: boolean,
  durationMs: number,
  delayMs: number,
  maxBlurPx: number,
  translateYRem: number,
): CSSProperties {
  const y = visible ? 0 : translateYRem;
  const transition =
    visible && durationMs > 0
      ? `opacity ${durationMs}ms ${ENTER_EASE} ${delayMs}ms, filter ${durationMs}ms ${ENTER_EASE} ${delayMs}ms, transform ${durationMs}ms ${ENTER_EASE} ${delayMs}ms`
      : "none";

  return {
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : `blur(${maxBlurPx}px)`,
    transform: `translateY(${y}rem)`,
    transition,
  };
}

export function playerEnterTotalDurationMs(
  staggerMs: number,
  durationMs: number,
): number {
  return (PLAYER_ENTER_ROW_COUNT - 1) * staggerMs + durationMs;
}
