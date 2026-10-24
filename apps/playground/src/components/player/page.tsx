import { PlayerBrandHeader } from "../player-brand/brand-header";
import { usePlayerBrandDialKit } from "../player-brand/dialkit";
import { PlayerBlurLayer } from "../player-blur/layer";
import { usePlayerBlurDialKit } from "../player-blur/dialkit";
import { PlayerFeatureContent } from "../player-feature/feature-content";
import { usePlayerFeatureDialKit } from "../player-feature/dialkit";
import { PlayerShadowLayers } from "../player-shadow/layers";
import { usePlayerShadowDialKit } from "../player-shadow/dialkit";
import { PlayerLayoutDemo } from "./layout-demo";

const MAIN_PAGE_DIAL_MOUNT = {
  foldersStartCollapsed: true,
  panelCollapsed: true,
} as const;

export function PlayerPage() {
  const brand = usePlayerBrandDialKit(MAIN_PAGE_DIAL_MOUNT);
  const feature = usePlayerFeatureDialKit(MAIN_PAGE_DIAL_MOUNT);
  const shadow = usePlayerShadowDialKit(MAIN_PAGE_DIAL_MOUNT);
  const blur = usePlayerBlurDialKit(MAIN_PAGE_DIAL_MOUNT);
  return (
    <PlayerLayoutDemo
      layoutMountOptions={MAIN_PAGE_DIAL_MOUNT}
      filter={
        <>
          <PlayerShadowLayers values={shadow} />
          <PlayerBlurLayer values={blur} />
        </>
      }
      header={<PlayerBrandHeader brand={brand} />}
      content={<PlayerFeatureContent feature={feature} />}
    />
  );
}
