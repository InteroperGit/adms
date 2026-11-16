// Pricing links accept published project destinations only.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/pricing.json";

afterEach(() => {
  vi.doUnmock("./projects");
  vi.doUnmock("@/data/content/config/pricing.json");
  vi.resetModules();
});

function load(status: string, linked = false) {
  vi.resetModules();
  vi.doMock("./projects", () => ({ projects: [{ id: 1, status }] }));
  const data = structuredClone(fixture);
  if (linked) {
    Object.assign(data.items[0], {
      href: "/projects/1",
      price: {
        ...data.items[0].price,
        context: "current",
        asOf: "2026-01-01",
      },
    });
  }
  vi.doMock("@/data/content/config/pricing.json", () => ({ default: data }));
  return import("./pricing");
}

it("exports parsed prices without promoting unapproved examples", async () => {
  const parsed = await load("demo");
  expect(parsed.pricing.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(parsed.publishedPricingExamples).toEqual([]);
  expect(parsed.visiblePricingExamples).toEqual([]);
  expect(parsed.formatPricingPrice(parsed.pricing.items[0].price)).toContain(
    "1",
  );
});

it.each(["demo", "draft"])("rejects links to %s projects", async (status) => {
  await expect(load(status, true)).rejects.toThrow(
    "Requires a generated approved agency project route",
  );
});

it("accepts a link to a published project", async () => {
  const parsed = await load("published", true);
  expect(parsed.pricing.items[0].href).toBe("/projects/1");
});
