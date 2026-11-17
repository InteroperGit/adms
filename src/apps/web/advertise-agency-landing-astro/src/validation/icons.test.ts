// @vitest-environment node
import { expect, it } from "vitest";
import fixture from "../../tests/fixtures/content/site/settings/icons.json";
import { expectContentContract } from "../../tests/helpers/contentContract";
import { iconsSchema } from "./icons";

it("enforces the icons settings contract", () => {
  expectContentContract(iconsSchema, fixture);
  expect(iconsSchema.parse(fixture)).toEqual(fixture);
});

it("rejects missing nested icons and unknown fields", () => {
  expect(
    iconsSchema.safeParse({ ...fixture, menu: { open: "bars" } }).success,
  ).toBe(false);
  expect(iconsSchema.safeParse({ ...fixture, extra: true }).success).toBe(
    false,
  );
});
