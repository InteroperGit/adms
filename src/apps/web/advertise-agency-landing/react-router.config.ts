import type { Config } from "@react-router/dev/config";
import { readFileSync } from "fs";
import path from "path";
import { readJson, walkJsonFiles, extractYearMonth } from "./scripts/buildUtils";
import {
  computeRouteManifest,
  loadPreviousManifest,
  diffManifest,
  writeBuildDiff,
} from "./src/plugins/incrementalSSG.ts";

// ---------------------------------------------------------------------------
// Helpers (Node-only, runs at build time)
// ---------------------------------------------------------------------------

interface CategoryEntry {
  name: string;
  slug: string;
}

interface CaseEntry {
  slug: string;
  category: string;
  publishDate: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default {
  appDirectory: "src",
  ssr: false,

  async prerender({ getStaticPaths }) {
    const root = process.cwd();

    const categories =
      readJson<CategoryEntry[]>(
        path.resolve(root, "data/content/config/categories.json")
      ) ?? [];
    const catSlugs = ["all", ...categories.map((c) => c.slug)];

    const portfolioDir = path.resolve(root, "data/content/portfolio");
    const cases = walkJsonFiles(portfolioDir).map(
      (f) => JSON.parse(readFileSync(f, "utf-8")) as CaseEntry
    );

    // /portfolio + /portfolio/<catSlug> for every category
    const categoryRoutes = [
      "/portfolio",
      ...catSlugs.map((s) => `/portfolio/${s}`),
    ];

    // Each case under /all/ and under its own category
    const caseRoutes = cases.flatMap((c) => {
      const { year, month } = extractYearMonth(c.publishDate);
      const catSlug = categories.find((cat) => cat.name === c.category)?.slug;
      const allPath = `/portfolio/all/${year}/${month}/${c.slug}`;
      return catSlug
        ? [allPath, `/portfolio/${catSlug}/${year}/${month}/${c.slug}`]
        : [allPath];
    });

    const allRoutes = [
      ...getStaticPaths(),
      "/404",
      ...categoryRoutes,
      ...caseRoutes,
    ];

    // Incremental build: compute manifest diff pre-build so React Router only
    // renders changed routes. Unchanged routes are restored from cache by
    // postbuild-cache.ts after the build completes.
    const currentManifest = computeRouteManifest(root);
    const previousManifest = loadPreviousManifest(root);
    const diff = diffManifest(previousManifest, currentManifest);

    writeBuildDiff(root, {
      unchanged: diff.unchanged,
      changed: diff.changed,
      globalChanged: diff.globalChanged,
      firstBuild: !previousManifest,
      manifest: currentManifest,
    });

    // Return only changed routes — unchanged ones will be restored from cache.
    // On first build or global hash change every route is in diff.changed.
    const unchangedSet = new Set(diff.unchanged);
    return allRoutes.filter((route) => !unchangedSet.has(route));
  },
} satisfies Config;
