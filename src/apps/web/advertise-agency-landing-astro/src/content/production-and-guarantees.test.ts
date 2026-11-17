// Preserve draft guidance; its caller checks publication.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { productionAndGuarantees } from "./production-and-guarantees";

const fixture = JSON.parse(
  await readFile(
    resolve(
      "tests/fixtures/content/site/sections/" +
        "production-and-guarantees.json",
    ),
    "utf8",
  ),
) as typeof productionAndGuarantees;

afterEach(() => {
  vi.doUnmock("@/data/content/site/sections/production-and-guarantees.json");
  vi.resetModules();
});

it("exports authored item IDs, order and optional empty photos", () => {
  expect(productionAndGuarantees.productionOperations).toEqual(
    fixture.productionOperations,
  );
  expect(productionAndGuarantees.materials.map(({ id }) => id)).toEqual(
    fixture.materials.map(({ id }) => id),
  );
  expect(productionAndGuarantees.photos).toEqual([]);
  expect(productionAndGuarantees.warrantyTerms[0]).toEqual(
    fixture.warrantyTerms[0],
  );
});

it("rejects a warranty missing required content", async () => {
  const warrantyTerms = fixture.warrantyTerms.map((term, index) => {
    if (index !== 0) {
      return term;
    }

    const { coverage: _coverage, ...missingCoverage } = term;
    return missingCoverage;
  });
  vi.resetModules();
  vi.doMock(
    "@/data/content/site/sections/production-and-guarantees.json",
    () => ({
      default: { ...fixture, warrantyTerms },
    }),
  );

  await expect(import("./production-and-guarantees")).rejects.toThrow(
    "Invalid content in data/content/site/sections/" +
      "production-and-guarantees.json",
  );
});

it("rejects an unsupported warranty source type", async () => {
  const warrantyTerms = fixture.warrantyTerms.map((term, index) =>
    index === 0 ? { ...term, sourceType: "unknown" } : term,
  );
  vi.resetModules();
  vi.doMock(
    "@/data/content/site/sections/production-and-guarantees.json",
    () => ({
      default: { ...fixture, warrantyTerms },
    }),
  );

  await expect(import("./production-and-guarantees")).rejects.toThrow(
    "Invalid content in data/content/site/sections/" +
      "production-and-guarantees.json",
  );
});
