const siteOutputs = new Map([
  ["about-carousel.json", "site/sections/about-carousel.json"],
  ["about.json", "site/sections/about.json"],
  ["action-rail.json", "site/sections/action-rail.json"],
  ["business-solutions.json", "site/sections/business-solutions.json"],
  ["faq.json", "site/sections/faq.json"],
  ["introduction.json", "site/sections/introduction.json"],
  ["offers.json", "site/sections/offers.json"],
  ["ordering-process.json", "site/sections/ordering-process.json"],
  ["pricing.json", "site/sections/pricing.json"],
  [
    "production-and-guarantees.json",
    "site/sections/production-and-guarantees.json",
  ],
  ["icons.json", "site/settings/icons.json"],
  ["site.json", "site/settings/site.json"],
  ["legal/privacy-policy.json", "site/pages/legal/privacy-policy.json"],
  ["legal/terms-of-use.json", "site/pages/legal/terms-of-use.json"],
  ["order-inquiry.json", "site/pages/order-inquiry.json"],
  ["project-catalog.json", "site/pages/project-catalog.json"],
  ["project-categories.json", "site/lists/project-categories.json"],
  ["projects.json", "site/lists/projects.json"],
  ["reviews.json", "site/lists/reviews.json"],
  ["services.json", "site/lists/services.json"],
]);

const jsonPaths = new Map(
  [...siteOutputs].flatMap(([name, target]) => [
    [`config/${name}`, target],
    [target, target],
  ]),
);
const mdxPaths = new Set([
  "articles/projects/1.mdx",
  "articles/services/starter-service.mdx",
]);

function fail(message) {
  throw new Error(`Content manifest is invalid: ${message}`);
}

export function validateContentManifest(manifest) {
  if (manifest?.schemaVersion !== "1.0.0" || !Array.isArray(manifest.files)) {
    fail("schemaVersion 1.0.0 and files are required");
  }

  const paths = new Set();
  const outputs = new Set();
  const domains = new Set();
  for (const [index, entry] of manifest.files.entries()) {
    if (
      !entry ||
      typeof entry.path !== "string" ||
      typeof entry.output !== "string"
    ) {
      fail(`files[${index}] must define path and output`);
    }
    let domain;
    if (entry.kind === "json") {
      const pathDomain = jsonPaths.get(entry.path);
      const outputDomain = jsonPaths.get(entry.output);
      if (!pathDomain || !outputDomain) {
        fail(`files[${index}] uses an unknown JSON path`);
      }
      if (entry.path !== entry.output || pathDomain !== outputDomain) {
        fail(
          `files[${index}] path and output must use the same approved layout`,
        );
      }
      domain = pathDomain;
    } else if (entry.kind === "mdx") {
      if (!mdxPaths.has(entry.path) || entry.path !== entry.output) {
        fail(`files[${index}] uses an unknown MDX starter path`);
      }
      domain = entry.path;
    } else {
      fail(`files[${index}].kind must be json or mdx`);
    }

    if (paths.has(entry.path)) fail(`duplicate path: ${entry.path}`);
    if (outputs.has(entry.output)) fail(`duplicate output: ${entry.output}`);
    if (domains.has(domain)) fail(`duplicate content domain: ${domain}`);
    paths.add(entry.path);
    outputs.add(entry.output);
    domains.add(domain);
  }

  const jsonCount = manifest.files.filter(
    (entry) => entry.kind === "json",
  ).length;
  const mdxCount = manifest.files.filter(
    (entry) => entry.kind === "mdx",
  ).length;
  if (jsonCount !== 20 || mdxCount !== 2) {
    fail("manifest must contain 20 JSON files and 2 MDX starters");
  }
  return manifest.files;
}

export function fixtureSourcePath(entry) {
  if (entry.path.startsWith("config/")) return `site/${entry.path}`;
  if (entry.path.startsWith("articles/")) return `site/${entry.path}`;
  return entry.path;
}
