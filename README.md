# video-player

<p align="center">
  <img
    src="./apps/playground/public/zen_pDXTUC47BN%201.png"
    alt="Player page preview with background video, feature copy, play control, and episode carousel"
    width="920"
  />
</p>

Full-viewport **video player page** for React: background preview, feature copy, episode carousel, and atmosphere (blur, vignette). Install one [shadcn registry](https://ui.shadcn.com/docs/registry) block, pass `videos`, and render.

**Live preview:** https://kaori2499.github.io/video-player/

## Install

```bash
bunx --bun shadcn@latest add kaori2499/video-player/video-player-block
```

Requires a shadcn/ui project (Tailwind v4, `button`, `kbd`). The block pulls in layout, preview, feature, carousel, brand, shadow, and blur as source under `components/video-player-block/`.

After GitHub Pages has published the registry JSON, you can also use:

```bash
bunx --bun shadcn@latest add @video-player/video-player-block
```

(`@video-player` → `https://kaori2499.github.io/video-player/r/{name}.json` in this repo’s `components.json`.)

## Usage

```tsx
import { VideoPlayerBlock } from "@/components/video-player-block/video-player-block";

const videos = [
  {
    url: "/media/episode-01.mp4",
    poster: "/media/episode-01.jpg",
    metadata: {
      title: "Episode title",
      description: "Short description shown in the feature column.",
      date: "2024-10-29",
      durationLabel: "16 min",
      links: [{ label: "Source", href: "https://example.com" }],
    },
  },
  // …
];

export function PlayerPage() {
  return (
    <VideoPlayerBlock
      videos={videos}
      onPlay={() => {
        /* open your player overlay or route */
      }}
    />
  );
}
```

| Field | Role |
| --- | --- |
| `videos` | Clips in the carousel; drives preview, copy, and active index |
| `defaultActiveIndex` | Optional starting episode (default `0`) |
| `onPlay` | Play button and **P** shortcut (when focus is not in a field) |
| `children` | Optional nodes inside the player context (e.g. bind play to a custom overlay via `VideoPlayerBlockBindPlay`) |

Typography, motion, spacing, shadows, and blur are fixed inside the block—no DialKit-style props.

### `VideoPlayerBlockBindPlay`

When playback lives in a child provider:

```tsx
<VideoPlayerBlock videos={videos}>
  <PlaybackProvider>
    <VideoPlayerBlockBindPlay onPlay={openPlayback} />
  </PlaybackProvider>
</VideoPlayerBlock>
```

## npm package (optional)

For lower-level pieces or the Limeplay **VideoPlayer** (Shaka, controls, playlist), use `@component-template/react`:

```bash
bun run build   # in this monorepo, or install from npm when published
```

```tsx
import { PlayerLayout, VideoPlayer } from "@component-template/react";
import "@component-template/react/styles.css";
```

Individual UI regions are also on the registry (`player-layout`, `player-feature`, `player-carousel`, …) if you prefer to compose instead of `video-player-block`.

## Develop this repo

```bash
bun install
bun run dev          # playground at http://127.0.0.1:5173 — `/` is the full block
bun run typecheck
bun run test:e2e     # bunx playwright install chromium once
```

```bash
bun run sync:registry    # copy packages/react/src → registry/items/video-player/
bun run registry:build   # sync + apps/playground/public/r/*.json for Pages
```

## License

MIT — see [LICENSE](./LICENSE).

## Credits

See [.credits.txt](./.credits.txt) and [Mixkit](https://mixkit.co/) for playground carousel media.
