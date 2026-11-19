/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default getViteConfig({
  resolve: {
    // Category registries are imported by project types and validators.
    // Resolve their JSON to versioned data even on a clean CI checkout.
    alias: {
      "@/data/content/config": fileURLToPath(
        new URL("./tests/fixtures/content/site/config", import.meta.url),
      ),
      "@/data/content/site/settings": fileURLToPath(
        new URL("./tests/fixtures/content/site/settings", import.meta.url),
      ),
      "@/data/content/site": fileURLToPath(
        new URL("./tests/fixtures/content/site", import.meta.url),
      ),
    },
  },
  test: {
    // Astro assets import virtual modules that must pass through Vite.
    server: { deps: { inline: ["astro"] } },
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // Discover both legacy suites and tests colocated with source modules.
    include: [
      "tests/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", "dist", "output", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"],
      // Include pure modules and every colocated component in the gate.
      include: [
        "src/validation/**/*.ts",
        "src/content/blockPublication.ts",
        "src/content/pricingPublication.ts",
        "src/content/projectCategories.ts",
        "src/content/faqPublication.ts",
        "src/content/introductionPublication.ts",
        "src/content/projectPublication.ts",
        "src/content/servicePublication.ts",
        "src/content/articleContext.ts",
        "src/content/orderFormRegistry.ts",
        "src/content/paragraphLinks.ts",
        "src/content/contentBlockLabels.ts",
        "src/components/ui/media/resolveImage.ts",
        "src/server/inquiryPayload.ts",
        "src/scripts/projectCatalog.ts",
        "src/scripts/chartRuntime.ts",
        "src/components/forms/orderInquiry.ts",
        // Colocated tests keep every component in the coverage report.
        "src/components/**/*.{astro,ts,tsx}",
      ],
    },
  },
} as Parameters<typeof getViteConfig>[0]);
