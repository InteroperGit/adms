import type { Config } from "@react-router/dev/config";
import { readFileSync } from "fs";
import path from "path";
import { readJson, walkJsonFiles, extractYearMonth } from "./scripts/utils/buildUtils";
import {
  computeRouteManifest,
  diffManifest,
  loadPreviousManifest,
  writeBuildDiff,
} from "./src/plugins/incrementalSSGPlugin.ts";

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
  publishedAt: string;
}

interface GenericArticleEntry {
  slug: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default {
  appDirectory: "src",
  ssr: false,

  async prerender({ getStaticPaths }) {
    const root = process.cwd();

    // --- Category config ---
    const categories =
      readJson<CategoryEntry[]>(
        path.resolve(root, "data/content/config/categories.json"),
      ) ?? [];
    const catSlugs = [...categories.map((c) => c.slug)];

    // --- Portfolio routes ---
    const portfolioDir = path.resolve(root, "data/content/portfolio");
    const portfolioArticles = walkJsonFiles(portfolioDir).map(
      (f) => JSON.parse(readFileSync(f, "utf-8")) as CaseEntry,
    );

    const portfolioCategoryRoutes = ["/portfolio", ...catSlugs.map((s) => `/portfolio/${s}`)];

    const portfolioRoutes = portfolioArticles.flatMap((c) => {
      const { year, month } = extractYearMonth(c.publishedAt);
      const catSlug = categories.find((cat) => cat.name === c.category)?.slug;
      return catSlug
        ? [`/portfolio/${catSlug}/${year}/${month}/${c.slug}`]
        : [];
    });

    // --- Service / News / Blog article routes ---
    const svcArticles = walkJsonFiles(path.resolve(root, "data/content/services")).map(
      (f) => JSON.parse(readFileSync(f, "utf-8")) as GenericArticleEntry,
    );
    const newsArticles = walkJsonFiles(path.resolve(root, "data/content/news")).map(
      (f) => JSON.parse(readFileSync(f, "utf-8")) as GenericArticleEntry,
    );
    const blogArticles = walkJsonFiles(path.resolve(root, "data/content/blog")).map(
      (f) => JSON.parse(readFileSync(f, "utf-8")) as GenericArticleEntry,
    );

    const svcRoutes = ["/services", ...svcArticles.map((a) => `/services/${a.slug}`)];

    const newsRoutes = newsArticles.flatMap((a) => {
      const { year, month } = extractYearMonth(a.publishedAt);
      return [`/news`, `/news/${year}/${month}/${a.slug}`];
    });

    const blogRoutes = blogArticles.flatMap((a) => {
      const { year, month } = extractYearMonth(a.publishedAt);
      return [`/blog`, `/blog/${year}/${month}/${a.slug}`];
    });

    const allRoutes = [
      ...getStaticPaths(),
      "/404",
      ...portfolioCategoryRoutes,
      ...portfolioRoutes,
      ...svcRoutes,
      ...newsRoutes,
      ...blogRoutes,
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
    const unchangedSet = new Set(diff.unchanged);
    return allRoutes.filter((route) => !unchangedSet.has(route));
  },
} satisfies Config;
