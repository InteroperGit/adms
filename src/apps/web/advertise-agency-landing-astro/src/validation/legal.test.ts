// @vitest-environment node
import { expect, it } from "vitest";
import fixture from "@/data/content/site/pages/legal/privacyPolicy.json";
import { expectContentContract } from "../../tests/helpers/content-contract";
import { legalDocumentSchema } from "./legal";

it("enforces legal document and optional list contracts", () => {
  expectContentContract(legalDocumentSchema, fixture);
  expect(legalDocumentSchema.parse(fixture)).toEqual(fixture);
  expect(
    legalDocumentSchema.safeParse({
      ...fixture,
      sections: [{ heading: "Heading", content: "Body", list: ["Item"] }],
    }).success,
  ).toBe(true);
});

it("rejects malformed sections and unknown fields", () => {
  expect(
    legalDocumentSchema.safeParse({
      ...fixture,
      sections: [{ heading: "Heading", content: "Body", list: [1] }],
    }).success,
  ).toBe(false);
  expect(
    legalDocumentSchema.safeParse({ ...fixture, extra: true }).success,
  ).toBe(false);
});
