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
