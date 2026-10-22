import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "tailwindcss",
    "shaka-player",
    "zustand",
    "immer",
    "@phosphor-icons/react",
    "@base-ui/react",
    "radix-ui",
    "@radix-ui/react-slot",
    "@radix-ui/react-toggle",
    "@radix-ui/react-compose-refs",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lodash.clamp",
    "lodash",
    "date-fns",
    "date-fns/intervalToDuration",
  ],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      "@": path.join(root, "src"),
    };
  },
});
