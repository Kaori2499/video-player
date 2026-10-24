import { PlayerFeature } from "@component-template/react";
import type { PlayerFeatureDialValues } from "./dialkit";

const DEMO_TITLE = "Episode 06";
const DEMO_DESCRIPTION =
  "Tara Feener, Product Engineering Manager at the Browser Company, discusses what inspires her when building.";

export function PlayerFeatureContent({
  feature,
}: {
  feature: PlayerFeatureDialValues;
}) {
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
        <PlayerFeature.Intro>
          <PlayerFeature.Title>{DEMO_TITLE}</PlayerFeature.Title>
          <PlayerFeature.Description>{DEMO_DESCRIPTION}</PlayerFeature.Description>
        </PlayerFeature.Intro>
        <PlayerFeature.Play />
        <PlayerFeature.DetailsRow>
          <PlayerFeature.FollowLabel />
          <PlayerFeature.Social.Youtube />
          <PlayerFeature.Social.Spotify />
          <PlayerFeature.Social.ApplePodcasts />
          <PlayerFeature.Dot />
          <PlayerFeature.Date dateTime="2024-10-29">
            {feature.dateText}
          </PlayerFeature.Date>
          <PlayerFeature.Dot />
          <PlayerFeature.Duration>{feature.durationText}</PlayerFeature.Duration>
        </PlayerFeature.DetailsRow>
      </PlayerFeature.Root>
    </div>
  );
}
