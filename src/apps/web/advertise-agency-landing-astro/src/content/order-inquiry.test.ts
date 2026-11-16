// Inquiry export validation stays separate from browser submission behavior.
import { afterEach, expect, it, vi } from "vitest";
import fixture from
  "../../tests/fixtures/content/site/config/order-inquiry.json";
import { orderInquiry } from "./order-inquiry";

afterEach(() => {
  vi.doUnmock("@/data/content/config/order-inquiry.json");
  vi.resetModules();
});

it("exports authored copy, field settings and disabled delivery", () => {
  expect(orderInquiry.title).toBe(fixture.title);
  expect(orderInquiry.submitLabel).toBe(fixture.submitLabel);
  expect(orderInquiry.submission).toEqual(fixture.submission);
  expect(orderInquiry.fields.phone).toEqual(fixture.fields.phone);
  expect(orderInquiry.consent).toEqual(fixture.consent);
});

it("rejects missing required inquiry copy at the export boundary", async () => {
  const { title: _title, ...missingTitle } = fixture;
  vi.resetModules();
  vi.doMock("@/data/content/config/order-inquiry.json", () => ({
    default: missingTitle,
  }));

  await expect(import("./order-inquiry")).rejects.toThrow(
    "Invalid content in data/content/config/order-inquiry.json",
  );
});

it("rejects a malformed delivery endpoint at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/order-inquiry.json", () => ({
    default: {
      ...fixture,
      submission: { ...fixture.submission, endpoint: "http://invalid.test" },
    },
  }));

  await expect(import("./order-inquiry")).rejects.toThrow(
    "Invalid content in data/content/config/order-inquiry.json",
  );
});
