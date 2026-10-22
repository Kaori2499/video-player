import {
  PlayerBlur,
  PlayerLayout,
  PlayerPreview,
  PlayerShadow,
} from "@component-template/react";
import { useDemoVideos } from "./useDemoVideos";

export function App() {
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
      >
        <PlayerLayout.Background data-testid="player-layout-background">
          <PlayerPreview.Active />
        </PlayerLayout.Background>
        <PlayerLayout.Filter data-testid="player-layout-filter">
          <PlayerShadow edge="left" />
          <PlayerShadow edge="right" minViewport="2xl" />
          <PlayerBlur />
        </PlayerLayout.Filter>
        <PlayerLayout.Header data-testid="player-layout-header" />
        <PlayerLayout.Content data-testid="player-layout-content" />
        <PlayerLayout.Footer data-testid="player-layout-footer" />
      </PlayerLayout.Root>
    </PlayerLayout.Provider>
  );
}
