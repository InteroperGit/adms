// The about export preserves its versioned fixture content.
import { expect, it } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/about.json";
import { about } from "./about";

it("exports the authored descriptions, stats and icon", () => {
  expect(about).toEqual(fixture);
  expect(about.description1).toBe(fixture.description1);
  expect(about.description2).toBe(fixture.description2);
  expect(about.stats).toEqual(fixture.stats);
  expect(about.icon).toBe(fixture.icon);
});
