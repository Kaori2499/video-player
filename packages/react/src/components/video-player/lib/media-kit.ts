import { assetFeature } from "@/hooks/limeplay/use-asset"
import { captionsFeature } from "@/hooks/limeplay/use-captions"
import { mediaFeature } from "@/hooks/limeplay/use-media"
import { fullscreenFeature } from "@/hooks/limeplay/use-fullscreen"
import { pictureInPictureFeature } from "@/hooks/limeplay/use-picture-in-picture"
import { playbackFeature } from "@/hooks/limeplay/use-playback"
import { playbackRateFeature } from "@/hooks/limeplay/use-playback-rate"
import { playerFeature } from "@/hooks/limeplay/use-player"
import { playlistFeature } from "@/hooks/limeplay/use-playlist"
import { timelineFeature } from "@/hooks/limeplay/use-timeline"
import { volumeFeature } from "@/hooks/limeplay/use-volume"
import {
  createMediaKit,
  useMediaApi as useProviderMediaApi,
  useMediaEvents as useProviderMediaEvents,
} from "@/components/limeplay/media-provider"

const media = createMediaKit({
  features: [
    mediaFeature(),
    playerFeature(),
    playbackFeature(),
    playlistFeature(),
    volumeFeature(),
    timelineFeature(),
    captionsFeature(),
    playbackRateFeature(),
    pictureInPictureFeature(),
    fullscreenFeature(),
    assetFeature(),
  ] as const,
})

export const MediaProvider = media.MediaProvider

// Annotate with provider hook types so .d.ts does not need to name kit unique-symbol brands.
export const useMediaApi: typeof useProviderMediaApi = media.useMediaApi as typeof useProviderMediaApi
export const useMediaEvents: typeof useProviderMediaEvents =
  media.useMediaEvents as typeof useProviderMediaEvents
