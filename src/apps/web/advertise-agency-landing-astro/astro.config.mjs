import { defineConfig } from "astro/config";
import { resolve } from "node:path";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import remarkContentBlocks from "./src/content/mdxBlocks.mjs";

const productionUrl = process.env.PUBLIC_SITE_URL?.trim();
const contentRoot =
  process.env.E2E_CONTENT_ROOT ??
  process.env.CI_CONTENT_ROOT ??
  "./data/content";

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkContentBlocks],
      smartypants: false,
    }),
  },
  // Set the confirmed production origin in PUBLIC_SITE_URL at release time.
  site: productionUrl || undefined,
  output: "static",
  server: { host: "127.0.0.1", port: 4340 },
  vite: {
    resolve: {
      alias: [
        {
          find: "@/data/content",
          replacement: resolve(contentRoot),
        },
      ],
    },
    plugins: [tailwindcss()],
    server: {
      fs: {
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/output/**"],
      },
      watch: {
        // Skip tooling and artifacts; keep runtime content watched.
        ignored: [
          "**/.codex/**",
          "**/.github/**",
          "**/.npm-cache/**",
          "**/.playwright-cli/**",
          "**/.pnpm-store/**",
          "**/.tmp/**",
          "**/.vscode/**",
          "**/coverage/**",
          "**/dist/**",
          "**/docs/**",
          "**/output/**",
          "**/release-export/**",
        ],
      },
    },
  },
});
