import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "packages/react/src");
const registryRoot = path.join(root, "registry/items/video-player");

const copies = [
  ["player.layout.tsx", "components/player-layout/player.layout.tsx"],
  ["player.context.tsx", "lib/player.context.tsx"],
  ["player.types.ts", "lib/player.types.ts"],
  ["player.feature.tsx", "components/player-feature/player.feature.tsx"],
  [
    "player.feature.crossfade.tsx",
    "components/player-feature/player.feature.crossfade.tsx",
  ],
  [
    "player.feature.simple-icon.tsx",
    "components/player-feature/player.feature.simple-icon.tsx",
  ],
  ["player.preview.tsx", "components/player-preview/player.preview.tsx"],
  ["player.carousel.tsx", "components/player-carousel/player.carousel.tsx"],
  ["player.brand.tsx", "components/player-brand/player.brand.tsx"],
  ["player.shadow.tsx", "components/player-shadow/player.shadow.tsx"],
  ["player.blur.tsx", "components/player-blur/player.blur.tsx"],
  ["player.shadow-gradient.ts", "components/player-shadow/player.shadow-gradient.ts"],
  [
    "video-player-block.tsx",
    "components/video-player-block/video-player-block.tsx",
  ],
];

if (existsSync(registryRoot)) {
  rmSync(registryRoot, { recursive: true, force: true });
}
mkdirSync(registryRoot, { recursive: true });

for (const [from, to] of copies) {
  const dest = path.join(registryRoot, to);
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(path.join(srcRoot, from), dest);
}
