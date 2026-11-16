// Introduction parsing preserves optional media and supplies its demo default.
import { afterEach, expect, it, vi } from "vitest";
import fixture from
  "../../tests/fixtures/content/site/config/introduction.json";
import { introduction } from "./introduction";

afterEach(() => {
  vi.doUnmock("@/data/content/config/introduction.json");
  vi.resetModules();
});

it("exports authored introduction copy and photo values", () => {
  expect(introduction.heading).toBe(fixture.heading);
  expect(introduction.action).toEqual(fixture.action);
  expect(introduction.photo).toEqual(fixture.photo);
});

it("defaults demo mode and accepts an absent photo", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/introduction.json", () => ({
    default: { ...fixture, demoMode: undefined, photo: null },
  }));

  const parsed = await import("./introduction");
  expect(parsed.introduction.demoMode).toBe(false);
  expect(parsed.introduction.photo).toBeNull();
});

it("rejects an unsupported action at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/introduction.json", () => ({
    default: {
      ...fixture,
      action: { ...fixture.action, href: "/unsupported" },
    },
  }));

  await expect(import("./introduction")).rejects.toThrow(
    "Invalid content in data/content/config/introduction.json",
  );
});
