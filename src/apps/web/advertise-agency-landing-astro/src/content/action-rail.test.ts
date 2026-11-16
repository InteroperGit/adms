// The action rail export parses its versioned configuration strictly.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/action-rail.json";
import { actionRail } from "./action-rail";

afterEach(() => {
  vi.doUnmock("@/data/content/config/action-rail.json");
  vi.resetModules();
});

it("exports the configured call reminder interval", () => {
  expect(actionRail).toEqual(fixture);
  expect(actionRail.callReminderIntervalSeconds).toBeGreaterThanOrEqual(30);
});

it("rejects malformed settings at the content export boundary", async () => {
  vi.resetModules();
  vi.doMock("@/data/content/config/action-rail.json", () => ({
    default: { callReminderIntervalSeconds: 29 },
  }));

  await expect(import("./action-rail")).rejects.toThrow();
});
