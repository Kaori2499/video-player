import { PlayerBrandHeader } from "../player-brand/brand-header";
import { usePlayerBrandDialKit } from "../player-brand/dialkit";
import { PlayerBlurLayer } from "../player-blur/layer";
import { usePlayerBlurDialKit } from "../player-blur/dialkit";
import { PlayerCarouselFooter } from "../player-carousel/carousel-footer";
import { usePlayerCarouselDialKit } from "../player-carousel/dialkit";
import { PlayerFeatureContent } from "../player-feature/feature-content";
import { usePlayerFeatureDialKit } from "../player-feature/dialkit";
import { PlayerShadowLayers } from "../player-shadow/layers";
import { usePlayerShadowDialKit } from "../player-shadow/dialkit";
import { PlayerEnterProvider, PlayerEnterRow } from "../player-enter/enter-context";
import { usePlayerPageEnterDialKit } from "../player-enter/dialkit";
import { PLAYER_ENTER_ROW } from "../player-enter/rows";
import { PlayerLayoutDemo } from "./layout-demo";

const MAIN_PAGE_DIAL_MOUNT = {
  foldersStartCollapsed: true,
  panelCollapsed: true,
} as const;

export function PlayerPage() {
  const brand = usePlayerBrandDialKit(MAIN_PAGE_DIAL_MOUNT);
  const carouselDial = usePlayerCarouselDialKit(MAIN_PAGE_DIAL_MOUNT);
  const feature = usePlayerFeatureDialKit(MAIN_PAGE_DIAL_MOUNT);
  const shadow = usePlayerShadowDialKit(MAIN_PAGE_DIAL_MOUNT);
  const blur = usePlayerBlurDialKit(MAIN_PAGE_DIAL_MOUNT);
  const pageEnter = usePlayerPageEnterDialKit(MAIN_PAGE_DIAL_MOUNT);

  return (
    <PlayerEnterProvider values={pageEnter.values} epoch={pageEnter.epoch}>
      <PlayerLayoutDemo
        layoutMountOptions={MAIN_PAGE_DIAL_MOUNT}
        filter={
          <>
            <PlayerShadowLayers values={shadow} />
            <PlayerBlurLayer values={blur} />
          </>
        }
        header={
          <PlayerEnterRow index={PLAYER_ENTER_ROW.brand}>
            <PlayerBrandHeader brand={brand} />
          </PlayerEnterRow>
        }
        content={<PlayerFeatureContent feature={feature} />}
        footer={
          <PlayerCarouselFooter
            carousel={carouselDial.values}
            slideEnter={pageEnter.values.carouselSlides}
            slideEnterEpoch={pageEnter.epoch + carouselDial.slideEnterEpoch}
            slideEnterBaseDelayMs={
              pageEnter.values.enabled
                ? PLAYER_ENTER_ROW.carousel * pageEnter.values.staggerMs
                : 0
            }
          />
        }
      />
    </PlayerEnterProvider>
  );
}
