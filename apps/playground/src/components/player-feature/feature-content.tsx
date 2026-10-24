import { PlayerFeature, PlayerLayout } from "@component-template/react";
import { formatCarouselDate } from "../../carousel/catalog";
import type { PlayerFeatureDialValues } from "./dialkit";

export function PlayerFeatureContent({
  feature,
}: {
  feature: PlayerFeatureDialValues;
}) {
  const { state } = PlayerLayout.useContext();
  const metadata = state.activeVideo?.metadata;
  const sourceLink = metadata?.links?.[0];

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-start p-4">
      <PlayerFeature.Root
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
      >
        {metadata?.title || metadata?.description ? (
          <PlayerFeature.Intro>
            {metadata.title ? (
              <PlayerFeature.Title>{metadata.title}</PlayerFeature.Title>
            ) : null}
            {metadata.description ? (
              <PlayerFeature.Description>
                {metadata.description}
              </PlayerFeature.Description>
            ) : null}
          </PlayerFeature.Intro>
        ) : null}
        <PlayerFeature.Play />
        <PlayerFeature.DetailsRow>
          <PlayerFeature.FollowLabel />
          <PlayerFeature.Social.Youtube />
          <PlayerFeature.Social.Spotify />
          <PlayerFeature.Social.ApplePodcasts />
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
        </PlayerFeature.DetailsRow>
      </PlayerFeature.Root>
    </div>
  );
}
