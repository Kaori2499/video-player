import { PlayerLayoutDemo } from "../player/layout-demo";
import { usePlayerShadowDialKit } from "./dialkit";
import { PlayerShadowLayers } from "./layers";

export function PlayerShadowPage() {
  const shadow = usePlayerShadowDialKit();

  return (
    <PlayerLayoutDemo filter={<PlayerShadowLayers values={shadow} />} />
  );
}
