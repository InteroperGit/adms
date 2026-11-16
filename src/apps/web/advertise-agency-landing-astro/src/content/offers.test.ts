// Offer exports preserve authored order and derive enabled items consistently.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/offers.json";
import { enabledOffers, offers } from "./offers";

afterEach(() => {
  vi.doUnmock("@/data/content/config/offers.json");
  vi.resetModules();
});

it("exports normalized offers with source IDs and order", () => {
  expect(offers.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(enabledOffers).toEqual(offers.items);
  expect(offers.items[0].description).toBe(fixture.items[0].description);
});

it("filters disabled offers without reordering enabled items", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/offers.json", () => ({
    default: {
      ...fixture,
      items: fixture.items.map((item, index) => ({
        ...item,
        enabled: index !== 1,
      })),
    },
  }));

  const parsed = await import("./offers");
  expect(parsed.offers.items.map(({ id }) => id)).toEqual([1, 2, 3]);
  expect(parsed.enabledOffers.map(({ id }) => id)).toEqual([1, 3]);
});

it("rejects an invalid offer interval at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/offers.json", () => ({
    default: { ...fixture, intervalMs: 4999 },
  }));

  await expect(import("./offers")).rejects.toThrow(
    "Invalid content in data/content/config/offers.json",
  );
});
