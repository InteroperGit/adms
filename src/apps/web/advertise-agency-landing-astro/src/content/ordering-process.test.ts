// Ordering-process export preserves editorial steps without approval claims.
import { afterEach, expect, it, vi } from "vitest";
import fixture from
  "../../tests/fixtures/content/site/config/ordering-process.json";
import { orderingProcess } from "./ordering-process";

afterEach(() => {
  vi.doUnmock("@/data/content/config/ordering-process.json");
  vi.resetModules();
});

it("exports step IDs and authored order with nullable approval source", () => {
  expect(orderingProcess.steps.map(({ id }) => id)).toEqual(
    fixture.steps.map(({ id }) => id),
  );
  expect(orderingProcess.steps[0]).toEqual(fixture.steps[0]);
  expect(orderingProcess.copyApproved).toBe(false);
  expect(orderingProcess.approvalSource).toBeNull();
});

it("rejects a step missing required description", async () => {
  const steps = fixture.steps.map((step, index) => {
    if (index !== 0) {
      return step;
    }

    const { description: _description, ...missingDescription } = step;
    return missingDescription;
  });
  vi.resetModules();
  vi.doMock("@/data/content/config/ordering-process.json", () => ({
    default: { ...fixture, steps },
  }));

  await expect(import("./ordering-process")).rejects.toThrow(
    "Invalid content in data/content/config/ordering-process.json",
  );
});

it("rejects a malformed step ID at the export boundary", async () => {
  const steps = fixture.steps.map((step, index) =>
    index === 0 ? { ...step, id: "INVALID ID" } : step,
  );
  vi.resetModules();
  vi.doMock("@/data/content/config/ordering-process.json", () => ({
    default: { ...fixture, steps },
  }));

  await expect(import("./ordering-process")).rejects.toThrow(
    "Invalid content in data/content/config/ordering-process.json",
  );
});
