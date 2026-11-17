// Provision synthetic CI data outside the authored runtime directory.
import { access, cp, mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fixtureSourcePath,
  validateContentManifest,
} from "./lib/contentManifest.mjs";

export async function prepareCiContent({
  templateRoot = "data/templates",
  fixtureRoot = "tests/fixtures/content",
  outputRoot = process.env.CI_CONTENT_ROOT ?? "output/ci-content",
} = {}) {
  const target = resolve(outputRoot);
  try {
    const entries = await readdir(target, { recursive: true });
    if (entries.length) {
      throw new Error(`CI content destination is not empty: ${target}`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const manifest = JSON.parse(
    await readFile(resolve(templateRoot, "manifest.json"), "utf8"),
  );
  const files = validateContentManifest(manifest);
  await access(target).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await mkdir(target, { recursive: true });

  for (const entry of files) {
    const source = resolve(fixtureRoot, fixtureSourcePath(entry));
    const destination = resolve(target, entry.output);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination);
  }
  return target;
}

async function main() {
  if (process.env.CI !== "true") {
    throw new Error("Synthetic content provisioning is restricted to CI");
  }
  console.log(`Prepared CI content at ${await prepareCiContent()}.`);
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) await main();
