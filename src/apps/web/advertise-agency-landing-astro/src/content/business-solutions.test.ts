// The business-solutions export joins copy and preserves source item order.
import { afterEach, expect, it, vi } from "vitest";
import fixture from
  "../../tests/fixtures/content/site/config/business-solutions.json";
import { businessSolutions } from "./business-solutions";

afterEach(() => {
  vi.doUnmock("@/data/content/config/business-solutions.json");
  vi.resetModules();
});

it("exports normalized solution copy in authored order", () => {
  expect(businessSolutions.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(businessSolutions.items[0].summary).toBe("TEST_SUMMARY");
  expect(businessSolutions.items[0].attribution).toMatchObject({
    customerName: null,
    projectId: null,
    href: null,
    evidence: null,
    media: [],
  });
});

it("rejects malformed solution data at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/business-solutions.json", () => ({
    default: { ...fixture, items: fixture.items.slice(0, 3) },
  }));

  await expect(import("./business-solutions")).rejects.toThrow(
    "Invalid content in data/content/config/business-solutions.json",
  );
});
