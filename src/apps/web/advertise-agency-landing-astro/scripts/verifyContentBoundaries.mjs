// Verify runtime-content boundaries and template safety before a commit.
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { validateContentManifest } from "./lib/contentManifest.mjs";

const root = resolve(".");
const templateRoot = resolve("data/templates");
const repositoryPrefix = git("rev-parse", "--show-prefix").trim();
const forbidden = [
  /data[\\/]content/i,
  /(?:api[_-]?key|secret|token|password)["']?\s*[:=]/i,
  /\b(?:javascript|data|file):/i,
  /<script\b/i,
  /(^|\n)\s*(?:import|export)\s/m,
];

function git(...args) {
  return execFileSync(
    "git",
    ["-c", "safe.directory=D:/Projects/adms", ...args],
    { cwd: root, encoding: "utf8" },
  );
}

function fail(message) {
  throw new Error(`Content boundary check failed: ${message}`);
}

async function assertJsonFilenames(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await assertJsonFilenames(path);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      !/^[a-z][A-Za-z0-9]*\.json$/.test(entry.name)
    ) {
      fail(`JSON filename must use camelCase: ${path}`);
    }
  }
}

await assertJsonFilenames(resolve("data"));
await assertJsonFilenames(resolve("tests/fixtures/content/site"));

const changed = [
  ...git("diff", "--name-only").split(/\r?\n/),
  ...git("diff", "--cached", "--name-only").split(/\r?\n/),
  ...git("ls-files", "--others", "--exclude-standard").split(/\r?\n/),
]
  .filter(Boolean)
  .map((path) => {
    const normalized = path.replaceAll("\\", "/");
    return repositoryPrefix && normalized.startsWith(repositoryPrefix)
      ? normalized.slice(repositoryPrefix.length)
      : normalized;
  });
const runtimeChanges = changed.filter(
  (path) => path === "data/content" || path.startsWith("data/content/"),
);
const movedTrackedService = "data/content/config/services.json";
if (runtimeChanges.includes(movedTrackedService)) {
  const previousBlob = git(
    "rev-parse",
    `HEAD:${repositoryPrefix}data/content/config/services.json`,
  ).trim();
  const currentBlob = git(
    "hash-object",
    "data/content/site/lists/services.json",
  ).trim();
  if (previousBlob === currentBlob) {
    runtimeChanges.splice(runtimeChanges.indexOf(movedTrackedService), 1);
  }
}
if (runtimeChanges.length) {
  fail(`runtime content changed or returned: ${runtimeChanges.join(", ")}`);
}

const manifest = JSON.parse(
  await readFile(join(templateRoot, "manifest.json"), "utf8"),
);
const trackedTemplates = git("ls-files", "data/templates")
  .split(/\r?\n/)
  .filter(Boolean);
if (!trackedTemplates.includes("data/templates/manifest.json")) {
  fail("data/templates/manifest.json must be tracked");
}
if (manifest.schemaVersion !== "1.0.0" || !Array.isArray(manifest.files)) {
  fail("template manifest must define schemaVersion 1.0.0 and files");
}
const entries = validateContentManifest(manifest);

for (const entry of entries) {
  const source = await readFile(join(templateRoot, entry.path), "utf8");
  if (entry.kind === "json") JSON.parse(source);
  for (const pattern of forbidden) {
    if (pattern.test(source)) fail(`forbidden template value: ${entry.path}`);
  }
}

console.log("Content boundaries, template manifest, and denylist passed.");
