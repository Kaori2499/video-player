# video-player

<p align="center">
  <img
    src="./apps/playground/public/zen_pDXTUC47BN%201.png"
    alt="Player page preview with background video, feature copy, play control, and episode carousel"
    width="920"
  />
</p>

Monorepo for a compound **player page** UI and a publishable React package built on [Limeplay](https://limeplay.dev/) (Shaka-backed `VideoPlayer`). The Vite playground hosts isolated demos, DialKit tuning panels, and a full-page preview with background video, feature copy, carousel, and overlay playback.

**Live playground:** https://kaori2499.github.io/video-player/

```
video-player/
├── packages/react/     # @component-template/react — layout, preview, feature, carousel, VideoPlayer
├── apps/playground/    # Vite app (routes per sub-system + main player page)
├── e2e/                # Playwright smoke tests
├── .github/workflows/  # CI + GitHub Pages
└── .credits.txt        # Design / inspiration references (also listed below)
```

## Commands

```bash
bun install
bun run build              # packages/react → dist/ (ESM + CJS + CSS)
bun run build:playground
bun run dev                # http://127.0.0.1:5173
bun run typecheck
bunx playwright install chromium   # once
bun run test:e2e
```

During development, the playground resolves `@component-template/react` to `packages/react/src` via Vite aliases so you can iterate without rebuilding `dist` on every change.

## Playground routes

| Path | Focus |
| --- | --- |
| `/` | Full player page (layout, brand, feature, carousel, playback overlay) |
| `/player-layout` | Layout regions and preview crossfade |
| `/player-brand` | Brand header |
| `/player-feature` | Title, description, play, social, metadata |
| `/player-carousel` | Episode carousel |
| `/player-shadow` | Edge shadow gradients |
| `/player-blur` | Background blur strength |

Carousel clips and posters are loaded from `apps/playground/public/carousel/` (catalog: `videos.json`). Preview video credits: [Mixkit](https://mixkit.co/) (see per-item `source` in the catalog).

## Package surface (`@component-template/react`)

Compound building blocks:

- **VideoPlayerBlock** — the full page block. Pass `videos`; preview, feature copy, carousel, and atmosphere are fixed
- **PlayerLayout** — full-viewport grid (background, filter, header, content, footer)
- **PlayerPreview** — looping or first-frame background video with crossfade
- **PlayerFeature** — metadata column (title, play, social, date/duration)
- **PlayerCarousel** — horizontal episode strip
- **PlayerBrand**, **PlayerShadow**, **PlayerBlur** — chrome and atmosphere
- **VideoPlayer** — Limeplay player with controls (timeline, volume, PiP, fullscreen, playlist)

```tsx
import { PlayerLayout, VideoPlayer } from "@component-template/react";
import "@component-template/react/styles.css";
```

Import styles once in your app root. React is a peer dependency.

## Install via shadcn (copy into your app)

This repo publishes a [shadcn registry](https://ui.shadcn.com/docs/registry) so you can install player building blocks the same way as primitives like `kbd`:

Install the whole page and pass `videos`. Sizes, motion, shadows, and blur are already set inside the block.

```tsx
import { VideoPlayerBlock } from "@/components/video-player-block/video-player-block";

<VideoPlayerBlock videos={videos} />
```

`videos` is `Player.Video[]`: `url`, optional `poster`, and optional `metadata` (`title`, `description`, `links`, `date`, `durationSeconds`, `durationLabel`). Pass `onPlay` when the play control should open your own player.

```bash
# Official shadcn/ui primitive (already in packages/react)
bunx --bun shadcn@latest add kbd

# After this repo is pushed and GitHub Pages has run registry:build:
bunx --bun shadcn@latest add @video-player/video-player-block

# Individual regions, if you compose them yourself:
bunx --bun shadcn@latest add @video-player/player-feature
bunx --bun shadcn@latest add @video-player/player-layout
bunx --bun shadcn@latest add @video-player/player-carousel
```

Or install from the public GitHub source registry (no pre-built `/r` JSON required):

```bash
bunx --bun shadcn@latest add kaori2499/video-player/video-player-block
```

**Maintainers:** registry source files are synced from `packages/react/src` into `registry/items/video-player/`:

```bash
bun run sync:registry      # copy sources
bun run registry:build     # sync + emit apps/playground/public/r/*.json for Pages
```

`components.json` in `packages/react` includes:

```json
"@video-player": "https://kaori2499.github.io/video-player/r/{name}.json"
```

The **Limeplay `VideoPlayer`** (Shaka, hooks, controls) is not a single-file registry item yet — use the npm package `@component-template/react` or copy from `packages/react/src/components/video-player` and `hooks/limeplay`. Registry items cover the compound **player page** UI (`PlayerLayout`, `PlayerFeature`, `PlayerCarousel`, etc.).

## Publishing

Only `packages/react` is intended for npm (`files`: `dist`). Build with `bun run build`; CSS is exported as `@component-template/react/styles.css`.

## License

MIT — see [LICENSE](./LICENSE).

## Credits

Design and interaction references (also kept in [.credits.txt](./.credits.txt)):

- [Linear — Quality 02](https://linear.app/quality/02)
- [Sonner](https://sonner.emilkowal.ski/)
- [Vaul](https://vaul.emilkowal.ski/)
- [Paco Coursey — X post](https://x.com/pacocoursey/status/1852482356944556250)
- [Linear — Custom feeds in Pulse (media players)](https://linear.app/changelog/2025-05-15-custom-feeds-in-pulse#new-media-players)
- [Emil Kowalski — X post](https://x.com/emilkowalski/status/2104656750620389844)
- [Julian Lehr — X post](https://x.com/julianlehr/status/1853075109700895094)
