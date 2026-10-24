import { DialRoot } from "dialkit";
import { PlayerBlurLayer } from "../player-blur/layer";
import { usePlayerBlurDialKit } from "../player-blur/dialkit";
import { usePlayerLayoutDialKit } from "../player-layout/dialkit";
import { PlayerShadowLayers } from "../player-shadow/layers";
import { usePlayerShadowDialKit } from "../player-shadow/dialkit";
import { PlayerLayoutShell } from "../player/layout-shell";
import { PlayerFeatureContent } from "./feature-content";
import { usePlayerFeatureDialKit } from "./dialkit";

const SECONDARY_PANEL = { panelCollapsed: true } as const;

export function PlayerFeaturePage() {
  const feature = usePlayerFeatureDialKit();
  const shadow = usePlayerShadowDialKit(SECONDARY_PANEL);
  const blur = usePlayerBlurDialKit(SECONDARY_PANEL);
  const layout = usePlayerLayoutDialKit(SECONDARY_PANEL);

  return (
    <>
      <PlayerLayoutShell
        layout={layout}
        preview="inactive"
        filter={
          <>
            <PlayerShadowLayers values={shadow} />
            <PlayerBlurLayer values={blur} />
          </>
        }
        content={<PlayerFeatureContent feature={feature} />}
      />
      <DialRoot position="top-right" theme="system" />
    </>
  );
}
