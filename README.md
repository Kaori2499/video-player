# component-template

GitHub **template repo** for building and previewing a publishable React component library.

Day-1 layout: one package, one Vite playground, Playwright e2e. Swap the stub `Button` for your component and keep the same tooling.

```
component-template/
鈹溾攢鈹€ packages/react/     # @component-template/react (publishable stub)
鈹溾攢鈹€ apps/playground/    # Vite preview host
鈹溾攢鈹€ e2e/                # Playwright against the playground
鈹溾攢鈹€ .github/workflows/  # CI: install 鈫?build 鈫?typecheck 鈫?e2e
鈹斺攢鈹€ playwright.config.ts
```

## Commands

```bash
bun install
bun run build          # packages/react 鈫?dist/ (ESM + CJS + CSS)
bun run dev            # playground 鈫?http://127.0.0.1:5173
bun run typecheck
bunx playwright install chromium   # once
bun run test:e2e
```

## Stub usage

```tsx
import { Button } from "@component-template/react";
import "@component-template/react/styles.css";

export function Example() {
  return (
    <>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
    </>
  );
}
```

## Replace the component

1. **Rename the package** (optional) in `packages/react/package.json` and update the `workspace:*` dependency in `apps/playground/package.json`.
2. **Replace `packages/react/src/`** 鈥?keep a thin `index.ts` public export surface; add files as needed (`component.tsx`, `types.ts`, `styles.css`, 鈥?.
3. **Update the playground** (`apps/playground/src/App.tsx`) to demo your API variants.
4. **Rewrite e2e** (`e2e/*.spec.ts`) to assert your `data-testid` / roles.
5. `bun run build && bun run typecheck && bun run test:e2e`

For toast / modal / command-palette APIs that need `callFromAnywhere()`, an imperative module store + single mount point is a common pattern 鈥?optional, not baked into this stub.

## Dev loop

- **Default:** edit `packages/react/src` 鈫?`bun run build` 鈫?refresh playground (playground imports `dist`).
- **Faster iteration:** `bun run --filter @component-template/react dev` (tsup `--watch`) in one terminal, `bun run dev` in another.
- Alternatively, point Vite at package `src` via an alias if you prefer HMR without rebuilding `dist` 鈥?not configured by default to keep the publish path honest.

## Publishing the package

Only `packages/react` is meant for npm (`"files": ["dist"]`). Dual ESM/CJS + `.d.ts` via tsup; CSS exported as `@component-template/react/styles.css`. React stays a peer dependency.

## Use as a GitHub Template

1. Push this repo to GitHub.
2. **Settings 鈫?General 鈫?Template repository** (check the box).
3. Others (or you) use **Use this template** to start a new component library.

## License

MIT 鈥?see `LICENSE`.

## GitHub Pages

Playground: https://kaori2499.github.io/video-player/
