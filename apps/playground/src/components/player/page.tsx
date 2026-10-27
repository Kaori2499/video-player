import {
  VideoPlayerBlock,
  VideoPlayerBlockBindPlay,
} from "@component-template/react";
import { useCarouselCatalog } from "../../carousel/useCarouselCatalog";
import {
  PlayerPlaybackProvider,
  usePlayerPlayback,
} from "../player-playback/playback-context";

function PlaybackBinding() {
  const { togglePlayback } = usePlayerPlayback();
  return <VideoPlayerBlockBindPlay onPlay={togglePlayback} />;
}

export function PlayerPage() {
  const { videos, status } = useCarouselCatalog();

  if (status === "loading") {
    return (
      <div data-testid="demo-loading" className="demo-loading">
        Loading carousel…
      </div>
    );
  }

  if (status === "error" || videos.length === 0) {
    return (
      <div data-testid="demo-loading" className="demo-loading">
        Could not load carousel videos.
      </div>
    );
  }

  return (
    <VideoPlayerBlock videos={videos}>
      <PlayerPlaybackProvider shortcut={false}>
        <PlaybackBinding />
      </PlayerPlaybackProvider>
    </VideoPlayerBlock>
  );
}
