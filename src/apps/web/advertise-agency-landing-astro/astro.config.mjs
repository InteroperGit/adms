import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import remarkContentBlocks from "./src/content/mdx-blocks.mjs";
// prettier-ignore
import articleAcceptance
  from './scripts/lib/article-acceptance-integration.mjs';

const productionUrl = process.env.PUBLIC_SITE_URL?.trim();
const acceptance = process.env.CONTENT_ACCEPTANCE === "true";

export default defineConfig({
  integrations: [mdx(), ...(acceptance ? [articleAcceptance()] : [])],
  ...(acceptance
    ? {
        outDir: "./output/playwright/task-080/dist",
      }
    : {}),
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
