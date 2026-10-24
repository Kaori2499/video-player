import { PlayerLayoutDemo } from "../player/layout-demo";
import { usePlayerBlurDialKit } from "./dialkit";
import { PlayerBlurLayer } from "./layer";

export function PlayerBlurPage() {
  const blur = usePlayerBlurDialKit();

  return <PlayerLayoutDemo filter={<PlayerBlurLayer values={blur} />} />;
}
