// The icon export keeps all configured registry keys and values.
import { expect, it } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/icons.json";
import { icons } from "./icons";

it("exports the configured top-level and nested icon keys", () => {
  expect(icons).toEqual(fixture);
  expect(Object.keys(icons)).toEqual(
    expect.arrayContaining([
      "phone",
      "email",
      "address",
      "clock",
      "arrow",
      "butterfly",
      "sparkles",
      "mail",
      "menu",
      "social",
    ]),
  );
  expect(Object.keys(icons.menu)).toEqual(
    expect.arrayContaining(["open", "close"]),
  );
  expect(Object.keys(icons.social)).toEqual(
    expect.arrayContaining(["youtube", "telegram", "vk"]),
  );
});
