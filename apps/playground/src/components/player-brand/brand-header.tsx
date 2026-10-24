import { PlayerBrand } from "@component-template/react";
import type { PlayerBrandDialValues } from "./dialkit";

export function PlayerBrandHeader({ brand }: { brand: PlayerBrandDialValues }) {
  return (
    <PlayerBrand.Root
      iconSizeRem={brand.iconSizeRem}
      separatorSizeRem={brand.separatorSizeRem}
      textSizeRem={brand.textSizeRem}
      gapRem={brand.gapRem}
    >
      <PlayerBrand.Icon />
      <PlayerBrand.Separator />
      <PlayerBrand.Label>
        <PlayerBrand.LabelLine>Player</PlayerBrand.LabelLine>
        <PlayerBrand.LabelLine>Component</PlayerBrand.LabelLine>
      </PlayerBrand.Label>
    </PlayerBrand.Root>
  );
}
