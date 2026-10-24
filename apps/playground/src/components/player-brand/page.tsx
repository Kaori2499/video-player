import { DialRoot } from "dialkit";
import { PlayerBlurLayer } from "../player-blur/layer";
import { usePlayerBlurDialKit } from "../player-blur/dialkit";
import { usePlayerLayoutDialKit } from "../player-layout/dialkit";
import { PlayerShadowLayers } from "../player-shadow/layers";
import { usePlayerShadowDialKit } from "../player-shadow/dialkit";
import { PlayerLayoutShell } from "../player/layout-shell";
import { PlayerBrandHeader } from "./brand-header";
import { usePlayerBrandDialKit } from "./dialkit";

const SECONDARY_PANEL = { panelCollapsed: true } as const;

export function PlayerBrandPage() {
  const brand = usePlayerBrandDialKit();
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
        header={<PlayerBrandHeader brand={brand} />}
      />
      <DialRoot position="top-right" theme="system" />
    </>
  );
}
