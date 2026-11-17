// @vitest-environment node
import { expect, it } from "vitest";
import fixture from "../../tests/fixtures/content/site/sections/about.json";
import { expectContentContract } from "../../tests/helpers/contentContract";
import { aboutSchema } from "./about";

it("enforces the about content contract", () => {
  expectContentContract(aboutSchema, fixture);
  expect(aboutSchema.parse(fixture)).toEqual(fixture);
});

it("rejects malformed statistics and unknown fields", () => {
  expect(
    aboutSchema.safeParse({ ...fixture, stats: [{ value: 1, label: "x" }] })
      .success,
  ).toBe(false);
  expect(aboutSchema.safeParse({ ...fixture, extra: true }).success).toBe(
    false,
  );
});
