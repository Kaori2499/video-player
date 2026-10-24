import { PlayerFeature, type Player } from "@component-template/react";
import { cn } from "@/lib/utils";
import { formatCarouselDate } from "../../carousel/catalog";
import { PlayerEnterRow } from "../player-enter/enter-context";
import { PLAYER_ENTER_ROW } from "../player-enter/rows";
import { usePlayerPlaybackOptional } from "../player-playback/playback-context";
import type { PlayerFeatureDialValues } from "./dialkit";

const featureContentAlignClassName =
  "max-sm:items-end sm:items-center";

const featureRootResponsiveClassName =
  "max-sm:[&_[data-vp-feature-part=title]]:!text-[1.5rem] max-sm:[&_[data-vp-feature-part=description]]:!max-w-none";

function FeatureSocialButtons() {
  return (
    <>
      <PlayerFeature.Social.Youtube />
      <PlayerFeature.Social.Spotify />
      <PlayerFeature.Social.ApplePodcasts />
    </>
  );
}

function FeatureMetaDetails({
  metadata,
  sourceLink,
}: {
  metadata: Player.VideoMetadata | undefined;
  sourceLink: Player.VideoLink | undefined;
}) {
  return (
    <>
      {sourceLink ? (
        <>
          <PlayerFeature.Links className="inline-flex w-auto gap-0 p-0">
            <PlayerFeature.Link
              href={sourceLink.href}
              target="_blank"
              rel="noreferrer"
            >
              {sourceLink.label}
            </PlayerFeature.Link>
          </PlayerFeature.Links>
        </>
      ) : null}
      {metadata?.date ? (
        <>
          {sourceLink ? <PlayerFeature.Dot /> : null}
          <PlayerFeature.Date dateTime={metadata.date}>
            {formatCarouselDate(metadata.date)}
          </PlayerFeature.Date>
        </>
      ) : null}
      {metadata?.durationLabel ? (
        <>
          {sourceLink || metadata.date ? <PlayerFeature.Dot /> : null}
          <PlayerFeature.Duration>
            {metadata.durationLabel}
          </PlayerFeature.Duration>
        </>
      ) : null}
    </>
  );
}

function PlayerFeatureContentBody({
  feature,
  video,
}: {
  feature: PlayerFeatureDialValues;
  video: Player.Video;
}) {
  const playback = usePlayerPlaybackOptional();
  const metadata = video.metadata;
  const sourceLink = metadata?.links?.[0];

  return (
    <PlayerFeature.Root
      className={featureRootResponsiveClassName}
      titleSizeRem={feature.titleSizeRem}
      descriptionSizeRem={feature.descriptionSizeRem}
      descriptionLineHeight={feature.descriptionLineHeight}
      linksSizeRem={feature.linksSizeRem}
      dateSizeRem={feature.dateSizeRem}
      durationSizeRem={feature.durationSizeRem}
      playSizeRem={feature.playSizeRem}
      socialButtonSizeRem={feature.socialButtonSizeRem}
      socialIconSizeRem={feature.socialIconSizeRem}
      socialButtonBg={feature.socialButtonBg}
      socialButtonHoverBg={feature.socialButtonHoverBg}
      gapRem={feature.gapRem}
      descriptionMaxWidthRem={feature.descriptionMaxWidthRem}
      plusLighter={feature.plusLighter}
    >
      {metadata?.title || metadata?.description ? (
        <PlayerFeature.Intro>
          {metadata.title ? (
            <PlayerEnterRow index={PLAYER_ENTER_ROW.title}>
              <PlayerFeature.Title>{metadata.title}</PlayerFeature.Title>
            </PlayerEnterRow>
          ) : null}
          {metadata.description ? (
            <PlayerEnterRow index={PLAYER_ENTER_ROW.description}>
              <PlayerFeature.Description>
                {metadata.description}
              </PlayerFeature.Description>
            </PlayerEnterRow>
          ) : null}
        </PlayerFeature.Intro>
      ) : null}
      <PlayerEnterRow index={PLAYER_ENTER_ROW.play}>
        <div className="flex w-full flex-wrap items-center gap-2">
          <PlayerFeature.Play
            className={cn(
              "[&_[data-slot=kbd]]:max-sm:hidden",
              "max-sm:h-8 max-sm:min-h-8 max-sm:px-3.5 max-sm:!text-[0.875rem]",
              "[&_svg]:max-sm:!size-3.5",
            )}
            onClick={() => {
              playback?.openPlayback();
            }}
          >
            <span className="sm:hidden">Play</span>
            <span className="hidden sm:inline">Play conversation</span>
          </PlayerFeature.Play>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 max-sm:flex sm:hidden">
            <PlayerFeature.FollowLabel />
            <FeatureSocialButtons />
          </div>
        </div>
      </PlayerEnterRow>
      <PlayerEnterRow index={PLAYER_ENTER_ROW.details}>
        <PlayerFeature.DetailsRow>
          <span className="hidden sm:contents">
            <PlayerFeature.FollowLabel />
            <FeatureSocialButtons />
            {sourceLink ? (
              <>
                <PlayerFeature.Dot />
                <PlayerFeature.Links className="inline-flex w-auto gap-0 p-0">
                  <PlayerFeature.Link
                    href={sourceLink.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sourceLink.label}
                  </PlayerFeature.Link>
                </PlayerFeature.Links>
              </>
            ) : null}
            {metadata?.date ? (
              <>
                <PlayerFeature.Dot />
                <PlayerFeature.Date dateTime={metadata.date}>
                  {formatCarouselDate(metadata.date)}
                </PlayerFeature.Date>
              </>
            ) : null}
            {metadata?.durationLabel ? (
              <>
                <PlayerFeature.Dot />
                <PlayerFeature.Duration>
                  {metadata.durationLabel}
                </PlayerFeature.Duration>
              </>
            ) : null}
          </span>
          <span className="contents sm:hidden">
            <FeatureMetaDetails metadata={metadata} sourceLink={sourceLink} />
          </span>
        </PlayerFeature.DetailsRow>
      </PlayerEnterRow>
    </PlayerFeature.Root>
  );
}

export function PlayerFeatureContent({
  feature,
}: {
  feature: PlayerFeatureDialValues;
}) {
  const transition = PlayerFeature.Crossfade.useTransition({
    enabled: feature.crossfade.enabled,
    exitDurationMs: feature.crossfade.exitDurationMs,
    enterDurationMs: feature.crossfade.enterDurationMs,
    maxBlurPx: feature.crossfade.maxBlurPx,
  });

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full justify-start p-4",
        featureContentAlignClassName,
        transition.isAnimating && "relative",
      )}
    >
      {transition.layers.map((layer) => (
        <div
          key={layer.key}
          className={cn(
            transition.isAnimating &&
              cn(
                "absolute inset-0 flex justify-start p-4",
                featureContentAlignClassName,
              ),
          )}
          style={
            transition.enabled
              ? PlayerFeature.Crossfade.layerStyle(
                  layer.visible,
                  layer.animationDurationMs,
                  transition.maxBlurPx,
                )
              : undefined
          }
          aria-hidden={transition.enabled && !layer.visible}
        >
          <PlayerFeatureContentBody feature={feature} video={layer.video} />
        </div>
      ))}
    </div>
  );
}
