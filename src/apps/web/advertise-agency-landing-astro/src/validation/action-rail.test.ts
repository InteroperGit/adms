// @vitest-environment node
import { expect, it } from "vitest";
import { actionRailConfigSchema } from "./action-rail";

it("applies the minimum reminder interval", () => {
  expect(actionRailConfigSchema.parse({}).callReminderIntervalSeconds).toBe(30);
  expect(
    actionRailConfigSchema.safeParse({
      callReminderIntervalSeconds: 29,
    }).success,
  ).toBe(false);
});

it("accepts configured intervals of at least thirty seconds", () => {
  expect(
    actionRailConfigSchema.parse({ callReminderIntervalSeconds: 45 })
      .callReminderIntervalSeconds,
  ).toBe(45);
});
