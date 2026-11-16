// The review export preserves authored identity and order without publication.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/reviews.json";
import { reviews } from "./reviews";

afterEach(() => {
  vi.doUnmock("@/data/content/config/reviews.json");
  vi.resetModules();
});

it("exports review IDs and authored copy in source order", () => {
  expect(reviews.map(({ id }) => id)).toEqual(
    fixture.map(({ id }) => id),
  );
  expect(reviews[0]).toEqual(fixture[0]);
});

it("rejects a review missing required text", async () => {
  const { text: _text, ...missingText } = fixture[0];
  vi.resetModules();
  vi.doMock("@/data/content/config/reviews.json", () => ({
    default: [missingText],
  }));

  await expect(import("./reviews")).rejects.toThrow(
    "Invalid content in data/content/config/reviews.json",
  );
});

it("rejects malformed review dimensions at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/reviews.json", () => ({
    default: [{ ...fixture[0], avatarWidth: 0 }],
  }));

  await expect(import("./reviews")).rejects.toThrow(
    "Invalid content in data/content/config/reviews.json",
  );
});
