// Keep export validation separate from browser submission.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "@/data/content/site/pages/orderInquiry.json";
import { orderInquiry } from "./orderInquiry";

afterEach(() => {
  vi.doUnmock("@/data/content/site/pages/orderInquiry.json");
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
  vi.doMock("@/data/content/site/pages/orderInquiry.json", () => ({
    default: missingTitle,
  }));

  await expect(import("./orderInquiry")).rejects.toThrow(
    "Invalid content in data/content/site/pages/orderInquiry.json",
  );
});

it("rejects a malformed delivery endpoint at the export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/site/pages/orderInquiry.json", () => ({
    default: {
      ...fixture,
      submission: { ...fixture.submission, endpoint: "http://invalid.test" },
    },
  }));

  await expect(import("./orderInquiry")).rejects.toThrow(
    "Invalid content in data/content/site/pages/orderInquiry.json",
  );
});
