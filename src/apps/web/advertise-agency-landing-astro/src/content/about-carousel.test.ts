// The carousel export preserves its authored IDs and applies schema defaults.
import { afterEach, expect, it, vi } from "vitest";
import fixture from
  "../../tests/fixtures/content/site/config/about-carousel.json";
import { aboutCarousel } from "./about-carousel";

afterEach(() => {
  vi.doUnmock("@/data/content/config/about-carousel.json");
  vi.resetModules();
});

it("exports authored carousel items with normalized presentation", () => {
  expect(aboutCarousel.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(aboutCarousel.items[0]).toMatchObject(fixture.items[0]);
  expect(aboutCarousel.items[0].presentation).toEqual({
    fontSizeRem: 1.125,
    textColor: "#ffffff",
    overlay: "dark",
    horizontal: "left",
    vertical: "bottom",
    focalPoint: { x: 50, y: 50 },
  });
});

it("rejects malformed carousel data at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/about-carousel.json", () => ({
    default: {
      ...fixture,
      items: [{ ...fixture.items[0], href: "/incomplete-link" }],
    },
  }));

  await expect(import("./about-carousel")).rejects.toThrow(
    "Invalid content in data/content/config/about-carousel.json",
  );
});
