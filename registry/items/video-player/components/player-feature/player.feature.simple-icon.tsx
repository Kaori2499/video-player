import type { CSSProperties } from "react";
import type { SimpleIcon } from "simple-icons";

export function PlayerFeatureSimpleIcon({
  icon,
  sizeRem,
  style,
}: {
  icon: SimpleIcon;
  sizeRem?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="fill-current"
      style={{
        width: sizeRem !== undefined ? `${sizeRem}rem` : undefined,
        height: sizeRem !== undefined ? `${sizeRem}rem` : undefined,
        ...style,
      }}
    >
      <path d={icon.path} />
    </svg>
  );
}
