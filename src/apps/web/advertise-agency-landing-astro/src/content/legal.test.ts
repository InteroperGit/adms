// Legal exports preserve their separate privacy and terms documents.
import { expect, it } from "vitest";
import privacyFixture from "@/data/content/config/legal/privacy-policy.json";
import termsFixture from "@/data/content/config/legal/terms-of-use.json";
import { privacyPolicy, termsOfUse } from "./legal";

it("pairs each legal export with its matching authored document", () => {
  expect(privacyPolicy).toEqual(privacyFixture);
  expect(termsOfUse).toEqual(termsFixture);
  expect(privacyPolicy).not.toEqual(termsOfUse);
  expect(privacyPolicy.sections[0].list).toBeUndefined();
  expect(termsOfUse.sections[0].list).toEqual(termsFixture.sections[0].list);
});
