// @vitest-environment node
import { expect, it } from "vitest";
import fixture from "../../tests/fixtures/content/site/settings/site.json";
import { expectContentContract } from "../../tests/helpers/contentContract";
import { parseContent } from "./parseContent";
import { siteSchema } from "./site";

it("enforces the site settings contract", () => {
  expectContentContract(siteSchema, fixture);
  expect(siteSchema.parse(fixture)).toEqual(fixture);
});

it("reports the source when nested site settings are invalid", () => {
  const invalid = () =>
    parseContent(
      siteSchema,
      { ...fixture, mapFallback: { ...fixture.mapFallback, width: "wide" } },
      "data/content/site/settings/site.json",
    );
  expect(invalid).toThrow(
    /Invalid content in data\/content\/site\/settings\/site\.json/,
  );
  expect(invalid).toThrow(/mapFallback\.width/);
});
