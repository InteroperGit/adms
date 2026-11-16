// The FAQ export joins answer lines while preserving authored question order.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/faq.json";
import { faq } from "./faq";

afterEach(() => {
  vi.doUnmock("@/data/content/config/faq.json");
  vi.resetModules();
});

it("exports normalized FAQ copy in authored order", () => {
  expect(faq.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(faq.items[0].answer).toBe(fixture.items[0].answer.join(" "));
  expect(faq.approval.state).toBe("draft");
});

it("rejects an empty FAQ list at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/faq.json", () => ({
    default: { ...fixture, items: [] },
  }));

  await expect(import("./faq")).rejects.toThrow(
    "Invalid content in data/content/config/faq.json",
  );
});
