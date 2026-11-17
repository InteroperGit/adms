// Build deterministic versioned fixtures, then let Playwright own preview.
import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { preview } from "astro";
import {
  fixtureSourcePath,
  validateContentManifest,
} from "./lib/content-manifest.mjs";

const root = resolve("output/playwright/content");
const templates = JSON.parse(
  await readFile("data/templates/manifest.json", "utf8"),
);
const overrides = JSON.parse(
  await readFile("tests/fixtures/content/e2e-overrides.json", "utf8"),
);
for (const entry of validateContentManifest(templates)) {
  const path = entry.output ?? entry.path;
  if (entry.kind === "mdx") {
    const target = resolve(root, path);
    await mkdir(dirname(target), { recursive: true });
    await cp(
      resolve("tests/fixtures/content", fixtureSourcePath(entry)),
      target,
    );
    continue;
  }
  const value = JSON.parse(
    await readFile(
      resolve("tests/fixtures/content", fixtureSourcePath(entry)),
      "utf8",
    ),
  );
  if (path === "site/pages/orderInquiry.json") {
    value.submission.enabled = true;
  }
  if (path === "site/lists/services.json") {
    value.demoMode = overrides.services.demoMode;
    value.copyApproved = overrides.services.copyApproved;
    const itemOverride = overrides.services.item;
    const service = value.items.find((item) => item.id === itemOverride.id);
    if (!service) {
      throw new Error(`E2E service not found: ${itemOverride.id}`);
    }
    service.confirmed = itemOverride.confirmed;
    service.copyApproved = itemOverride.copyApproved;
    service.image = { ...service.image, ...itemOverride.image };
    service.article = { ...service.article, ...itemOverride.article };
  }
  if (path === "site/lists/projects.json") {
    const project = value.find((item) => item.id === 1);
    if (!project) throw new Error("E2E project not found: 1");
    project.article.content.push(...overrides.projectBlocks);
  }
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(value, null, 2));
}
await mkdir(resolve(root, "fixtures/articles"), { recursive: true });
await cp(
  "tests/fixtures/content/articles",
  resolve(root, "fixtures/articles"),
  { recursive: true },
);

const env = {
  ...process.env,
  E2E_CONTENT_ROOT: "./output/playwright/content",
  PUBLIC_YANDEX_SMARTCAPTCHA_SITE_KEY: "e2e-public-key",
};
const astro = resolve("node_modules/astro/bin/astro.mjs");
let child;
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    child?.kill(signal);
  });
}
function run(args) {
  return new Promise((accept, reject) => {
    child = spawn(process.execPath, [astro, ...args], {
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) accept();
      else reject(new Error(`Astro exited with ${code}`));
    });
  });
}
// Astro writes importer maps to root .astro despite a separate cacheDir.
const sharedAstroFiles = [
  resolve(".astro/content-assets.mjs"),
  resolve(".astro/content-modules.mjs"),
];
const originalAstroFiles = new Map();
for (const file of sharedAstroFiles) {
  try {
    originalAstroFiles.set(file, await readFile(file));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

try {
  await run(["build", "--config", "scripts/e2e.config.mjs"]);
} finally {
  for (const file of sharedAstroFiles) {
    const original = originalAstroFiles.get(file);
    if (original) {
      await writeFile(file, original);
    } else {
      await rm(file, { force: true });
    }
  }
}
// The API avoids the CLI daemon and leaves existing preview servers alone.
const server = await preview({
  configFile: "scripts/e2e.config.mjs",
  server: { host: "127.0.0.1", port: 4327 },
});
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
