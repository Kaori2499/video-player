export { PlayerLayout } from "./player.layout";
export type {
  PlayerLayoutBackgroundProps,
  PlayerLayoutFilterProps,
  PlayerLayoutRegionProps,
  PlayerLayoutRootProps,
} from "./player.layout";
export type { Player } from "./player.types";
export { PlayerContextProvider, usePlayerContext } from "./player.context";
export type { PlayerContextProviderProps } from "./player.context";
export { PlayerPreview } from "./player.preview";
export type {
  PlayerPreviewActiveProps,
  PlayerPreviewCrossfadeProps,
  PlayerPreviewInactiveProps,
  PlayerPreviewUrlProps,
} from "./player.preview";
export { PLAYER_PREVIEW_CROSSFADE_MS } from "./player.preview";
export { PlayerBlur } from "./player.blur";
export type { PlayerBlurStrength, PlayerBlurSurfaceProps } from "./player.blur";
export {
  formatFeatureDuration,
  PLAYER_FEATURE_DEFAULTS,
  PlayerFeature,
} from "./player.feature";
export type {
  PlayerFeatureDateProps,
  PlayerFeatureDescriptionProps,
  PlayerFeatureDetailsRowProps,
  PlayerFeatureDotProps,
  PlayerFeatureDurationProps,
  PlayerFeatureFollowLabelProps,
  PlayerFeatureFromActiveVideoProps,
  PlayerFeatureSocialButtonProps,
  PlayerFeatureLinkProps,
  PlayerFeatureLinksProps,
  PlayerFeatureMetaProps,
  PlayerFeaturePlayProps,
  PlayerFeatureRootProps,
  PlayerFeatureTitleProps,
} from "./player.feature";
export { PLAYER_CAROUSEL_DEFAULTS, PlayerCarousel } from "./player.carousel";
export type {
  PlayerCarouselCaptionProps,
  PlayerCarouselControlsProps,
  PlayerCarouselEpisodeProps,
  PlayerCarouselImageProps,
  PlayerCarouselMediaProps,
  PlayerCarouselRootProps,
  PlayerCarouselSlideEase,
  PlayerCarouselSlideProps,
  PlayerCarouselTitleProps,
  PlayerCarouselTrackProps,
  PlayerCarouselViewportProps,
} from "./player.carousel";
export { PLAYER_BRAND_DEFAULTS, PlayerBrand } from "./player.brand";
export type {
  PlayerBrandIconProps,
  PlayerBrandLabelLineProps,
  PlayerBrandLabelProps,
  PlayerBrandRootProps,
  PlayerBrandSeparatorProps,
} from "./player.brand";
export { PLAYER_SHADOW_DEFAULTS, PlayerShadow } from "./player.shadow";
export type {
  PlayerShadowAxisMetrics,
  PlayerShadowEdge,
  PlayerShadowEdgeProps,
  PlayerShadowGradientEase,
  PlayerShadowMinViewport,
  PlayerShadowRootProps,
} from "./player.shadow";

export {
  VideoPlayer,
  type VideoPlayerAsset,
  type VideoPlayerProps,
} from "./components/video-player/player";
