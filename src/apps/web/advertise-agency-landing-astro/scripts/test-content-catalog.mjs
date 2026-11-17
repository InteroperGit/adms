// Verify deterministic generation and rejection of unsafe source packages.
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  fixtureSourcePath,
  validateContentManifest,
} from "./lib/content-manifest.mjs";
import { generateContentCatalog } from "./generate-content-catalog.mjs";
import { prepareCiContent } from "./prepare-ci-content.mjs";

const manifest = {
  schemaVersion: "1.0.0",
  files: [
    { path: "config/site.json", kind: "json", output: "config/site.json" },
    {
      path: "site/sections/about.json",
      kind: "json",
      output: "site/sections/about.json",
    },
    {
      path: "articles/service.mdx",
      kind: "mdx",
      output: "articles/service.mdx",
    },
  ],
};

async function createSource(root, files) {
  await mkdir(join(root, "config"), { recursive: true });
  await mkdir(join(root, "site/sections"), { recursive: true });
  await mkdir(join(root, "articles"), { recursive: true });
  await writeFile(
    join(root, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  for (const [path, content] of Object.entries(files)) {
    await writeFile(join(root, path), content);
  }
}

async function expectFailure(action, message) {
  await assert.rejects(action, (error) => {
    assert.match(error.message, new RegExp(message));
    return true;
  });
}

async function expectAbsent(path) {
  await assert.rejects(readFile(path), { code: "ENOENT" });
}

const workspace = await mkdtemp(join(tmpdir(), "content-catalog-"));
try {
  const complete = join(workspace, "complete");
  await createSource(complete, {
    "config/site.json": JSON.stringify({
      title: "PLACEHOLDER_TITLE",
      image: "media/example.webp",
    }),
    "site/sections/about.json": JSON.stringify({ title: "ABOUT_TITLE" }),
    "articles/service.mdx": "export const unsafe = true;\n",
  });
  const output = join(workspace, "output");
  await generateContentCatalog(complete, output);
  const first = await readFile(join(output, "config/site.json"), "utf8");
  assert.equal(
    first,
    '{\n  "title": "PLACEHOLDER_TITLE",\n' +
      '  "image": "/media/example.webp"\n}\n',
  );
  assert.equal(
    await readFile(join(output, "articles/service.mdx"), "utf8"),
    "export const unsafe = true;\n",
  );
  assert.equal(
    await readFile(join(output, "site/sections/about.json"), "utf8"),
    '{\n  "title": "ABOUT_TITLE"\n}\n',
  );
  assert.equal(
    await readFile(join(output, "site/site/sections/about.json")).catch(
      () => null,
    ),
    null,
  );
  const firstManifest = await readFile(join(output, "manifest.json"), "utf8");
  await assert.rejects(
    () => generateContentCatalog(complete, output),
    /output is not empty/,
  );
  await generateContentCatalog(complete, output, { force: true });
  assert.equal(
    await readFile(join(output, "manifest.json"), "utf8"),
    firstManifest,
  );

  await expectFailure(
    () => generateContentCatalog(complete, complete),
    "outside the template source directory",
  );

  const duplicateOutput = join(workspace, "duplicate-output");
  const duplicateManifest = {
    ...manifest,
    files: manifest.files.map((entry) => ({ ...entry, output: "same.json" })),
  };
  await writeFile(
    join(complete, "manifest.json"),
    `${JSON.stringify(duplicateManifest, null, 2)}\n`,
  );
  await expectFailure(
    () => generateContentCatalog(complete, duplicateOutput),
    "duplicate manifest output",
  );
  await writeFile(
    join(complete, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const incomplete = join(workspace, "incomplete");
  await mkdir(incomplete, { recursive: true });
  await writeFile(join(incomplete, "manifest.json"), JSON.stringify(manifest));
  await expectFailure(
    () => generateContentCatalog(incomplete, join(workspace, "missing")),
    "missing",
  );

  const forbidden = join(workspace, "forbidden");
  await createSource(forbidden, {
    "config/site.json": JSON.stringify({ apiKey: "DO_NOT_COMMIT" }),
    "site/sections/about.json": JSON.stringify({ title: "ABOUT_TITLE" }),
    "articles/service.mdx": "# TEST_ARTICLE",
  });
  await expectFailure(
    () => generateContentCatalog(forbidden, join(workspace, "unsafe")),
    "forbidden",
  );

  const productionManifest = JSON.parse(
    await readFile("data/templates/manifest.json", "utf8"),
  );
  const mixedManifest = structuredClone(productionManifest);
  for (const [from, to] of [
    ["config/pricing.json", "site/sections/pricing.json"],
  ]) {
    const entry = mixedManifest.files.find((item) => item.path === from);
    entry.path = to;
    entry.output = to;
  }
  assert.equal(validateContentManifest(mixedManifest), mixedManifest.files);
  assert.equal(
    fixtureSourcePath({ path: "site/settings/site.json" }),
    "site/settings/site.json",
  );

  const duplicateDomain = structuredClone(productionManifest);
  duplicateDomain.files.push({
    path: "config/about.json",
    kind: "json",
    output: "config/about.json",
  });
  assert.throws(
    () => validateContentManifest(duplicateDomain),
    /duplicate content domain/,
  );

  const unknownPath = structuredClone(mixedManifest);
  unknownPath.files.find((entry) => entry.kind === "json").path =
    "site/unapproved/unknown.json";
  assert.throws(
    () => validateContentManifest(unknownPath),
    /unknown JSON path/,
  );

  const templateRoot = join(workspace, "templates");
  const fixtureRoot = join(workspace, "fixtures");
  await cp("data/templates", templateRoot, { recursive: true });
  await cp("tests/fixtures/content/site", join(fixtureRoot, "site"), {
    recursive: true,
  });
  const migratedTemplate = join(templateRoot, "site/sections/pricing.json");
  const migratedFixture = join(fixtureRoot, "site/sections/pricing.json");
  const settingsPath = "site/settings/site.json";
  const migratedSettingsFixture = join(fixtureRoot, settingsPath);
  await mkdir(join(templateRoot, "site/sections"), { recursive: true });
  await mkdir(join(fixtureRoot, "site/sections"), { recursive: true });
  await mkdir(join(templateRoot, "site/settings"), { recursive: true });
  await mkdir(join(fixtureRoot, "site/settings"), { recursive: true });
  await cp(join(templateRoot, "config/pricing.json"), migratedTemplate);
  await cp(join(fixtureRoot, "site/config/pricing.json"), migratedFixture);
  await rm(join(templateRoot, "config/pricing.json"));
  const mixedTemplateManifest = JSON.parse(
    await readFile(join(templateRoot, "manifest.json"), "utf8"),
  );
  const migratedPricing = mixedTemplateManifest.files.find(
    (entry) => entry.path === "config/pricing.json",
  );
  migratedPricing.path = "site/sections/pricing.json";
  migratedPricing.output = migratedPricing.path;
  assert.ok(
    mixedTemplateManifest.files.some(
      (entry) => entry.path === settingsPath && entry.output === settingsPath,
    ),
  );
  await writeFile(
    join(templateRoot, "manifest.json"),
    `${JSON.stringify(mixedTemplateManifest, null, 2)}\n`,
  );

  const ciOutput = join(workspace, "ci-content");
  await prepareCiContent({ templateRoot, fixtureRoot, outputRoot: ciOutput });
  assert.equal(
    await readFile(join(ciOutput, "site/sections/pricing.json"), "utf8"),
    await readFile(migratedFixture, "utf8"),
  );
  assert.equal(
    await readFile(join(ciOutput, "site/settings/site.json"), "utf8"),
    await readFile(migratedSettingsFixture, "utf8"),
  );
  await expectAbsent(join(ciOutput, "site/site/settings/site.json"));
  await expectAbsent(join(ciOutput, "site/config/site.json"));
  await expectAbsent(join(ciOutput, "config/site.json"));
  assert.equal(
    await readFile(join(ciOutput, "type-contracts/about.ts")).catch(() => null),
    null,
  );
  await writeFile(join(ciOutput, "preserve.txt"), "keep\n");
  await assert.rejects(
    () => prepareCiContent({ templateRoot, fixtureRoot, outputRoot: ciOutput }),
    /destination is not empty/,
  );
  assert.equal(
    await readFile(join(ciOutput, "preserve.txt"), "utf8"),
    "keep\n",
  );

  console.log("Content catalog fixtures passed.");
} finally {
  await rm(workspace, { recursive: true, force: true });
}
