import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const playgroundDir = path.dirname(fileURLToPath(import.meta.url));
const reactPkgSrc = path.resolve(playgroundDir, "../../packages/react/src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "shaka-player",
      "shaka-player/dist/shaka-player.compiled.debug",
    ],
  },
  resolve: {
    alias: [
      {
        find: "@component-template/react/styles.css",
        replacement: path.resolve(reactPkgSrc, "styles.css"),
      },
      {
        find: "@component-template/react",
        replacement: path.resolve(reactPkgSrc, "index.ts"),
      },
      {
        find: "@",
        replacement: reactPkgSrc,
      },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});