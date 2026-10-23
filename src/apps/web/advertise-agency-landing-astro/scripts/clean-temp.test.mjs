import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { cleanTemporaryFiles } from "./clean-temp.mjs";

const temporaryRoots = [];

async function createRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), "clean-temp-"));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

test("preview lists cleanup targets without deleting files", async () => {
  const root = await createRoot();
  const target = path.join(root, "dist", "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, "built page");

  const results = await cleanTemporaryFiles({ root });

  assert.equal(results[3].status, "preview");
  assert.equal(await readFile(target, "utf8"), "built page");
});

test("apply removes only standard targets", async () => {
  const root = await createRoot();
  const generated = path.join(root, "coverage", "report.txt");
  const protectedFile = path.join(root, "data", "content.json");
  await mkdir(path.dirname(generated), { recursive: true });
  await mkdir(path.dirname(protectedFile), { recursive: true });
  await writeFile(generated, "report");
  await writeFile(protectedFile, "content");

  const results = await cleanTemporaryFiles({ root, apply: true });

  assert.equal(results[2].status, "removed");
  await assert.rejects(readFile(generated));
  assert.equal(await readFile(protectedFile, "utf8"), "content");
});

test("full output cleanup requires explicit selection", async () => {
  const root = await createRoot();
  const artifact = path.join(root, "output", "verification.log");
  await mkdir(path.dirname(artifact), { recursive: true });
  await writeFile(artifact, "evidence");

  await cleanTemporaryFiles({ root, apply: true });
  assert.equal(await readFile(artifact, "utf8"), "evidence");

  const results = await cleanTemporaryFiles({
    root,
    apply: true,
    includeOutput: true,
  });

  assert.equal(results.at(-1).relativeTarget, "output");
  assert.equal(results.at(-1).status, "removed");
  await assert.rejects(readFile(artifact));
});

test("targets missing from the project are reported and ignored", async () => {
  const root = await createRoot();

  const results = await cleanTemporaryFiles({ root, apply: true });

  assert.ok(results.every((result) => result.status === "missing"));
});

test("refuses a symbolic link as the project root", async (context) => {
  const root = await createRoot();
  const link = path.join(os.tmpdir(), `clean-temp-link-${Date.now()}`);

  try {
    await symlink(root, link, "junction");
  } catch (error) {
    if (["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) {
      context.skip("This environment does not allow creating symlinks.");
      return;
    }

    throw error;
  }

  await assert.rejects(
    cleanTemporaryFiles({ root: link, apply: true }),
    /project root that is a symbolic link/,
  );

  await rm(link, { force: true });
});
