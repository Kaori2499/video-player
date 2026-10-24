import { PlayerLayout, PlayerPreview } from "@component-template/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { PlayerLayoutDialValues } from "../player-layout/dialkit";
import {
  playerLayoutMaxWidthClassName,
  playerLayoutRegionStyle,
  playerLayoutRootStyle,
} from "../player-layout/dialkit";
import { useDemoVideos } from "../../useDemoVideos";

export function PlayerLayoutShell({
  layout,
  filter = null,
  header,
  content,
  footer,
  preview = "active",
}: {
  layout: PlayerLayoutDialValues;
  filter?: ReactNode;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  preview?: "active" | "inactive";
}) {
  const { videos, status } = useDemoVideos();

  if (status === "loading") {
    return (
      <div data-testid="demo-loading" className="demo-loading">
        Loading open videos…
      </div>
    );
  }

  return (
    <PlayerLayout.Provider videos={videos}>
      <PlayerLayout.Root
        data-testid="player-layout"
        data-video-count={videos.length}
        className={playerLayoutMaxWidthClassName(layout.root.maxWidth)}
        style={playerLayoutRootStyle(layout.root)}
      >
        <PlayerLayout.Background data-testid="player-layout-background">
          {preview === "inactive" ? (
            <PlayerPreview.Inactive />
          ) : (
            <PlayerPreview.Active />
          )}
        </PlayerLayout.Background>
        <PlayerLayout.Filter data-testid="player-layout-filter">
          {filter}
        </PlayerLayout.Filter>
        <PlayerLayout.Header
          data-testid="player-layout-header"
          className={cn(
            playerLayoutMaxWidthClassName(layout.header.maxWidth),
            header && "flex items-center",
          )}
          style={playerLayoutRegionStyle(layout.header)}
        >
          {header}
        </PlayerLayout.Header>
        <PlayerLayout.Content
          data-testid="player-layout-content"
          className={playerLayoutMaxWidthClassName(layout.content.maxWidth)}
          style={playerLayoutRegionStyle(layout.content)}
        >
          {content}
        </PlayerLayout.Content>
        <PlayerLayout.Footer
          data-testid="player-layout-footer"
          className={cn(
            playerLayoutMaxWidthClassName(layout.footer.maxWidth),
            footer && "flex w-full min-w-0 flex-col items-center justify-center",
          )}
          style={playerLayoutRegionStyle(layout.footer)}
        >
          {footer}
        </PlayerLayout.Footer>
      </PlayerLayout.Root>
    </PlayerLayout.Provider>
  );
}
