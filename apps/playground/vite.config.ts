import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const playgroundDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@component-template/react/styles.css",
        replacement: path.resolve(
          playgroundDir,
          "../../packages/react/src/styles.css"
        ),
      },
      {
        find: "@component-template/react",
        replacement: path.resolve(
          playgroundDir,
          "../../packages/react/src/index.ts"
        ),
      },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});