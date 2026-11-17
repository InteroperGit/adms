const jsonPaths = new Map(
  [
    "site/sections/aboutCarousel.json",
    "site/sections/about.json",
    "site/sections/actionRail.json",
    "site/sections/businessSolutions.json",
    "site/sections/faq.json",
    "site/sections/introduction.json",
    "site/sections/offers.json",
    "site/sections/orderingProcess.json",
    "site/sections/pricing.json",
    "site/sections/productionAndGuarantees.json",
    "site/settings/icons.json",
    "site/settings/site.json",
    "site/pages/legal/privacyPolicy.json",
    "site/pages/legal/termsOfUse.json",
    "site/pages/orderInquiry.json",
    "site/pages/projects.json",
    "site/lists/projectCategories.json",
    "site/lists/projects.json",
    "site/lists/reviews.json",
    "site/lists/services.json",
  ].map((path) => [path, path]),
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
      if (!/^[a-z][A-Za-z0-9]*\.json$/.test(entry.path.split("/").at(-1))) {
        fail(`files[${index}] JSON filename must use camelCase`);
      }
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
  if (entry.path.startsWith("articles/")) return `site/${entry.path}`;
  return entry.path;
}
