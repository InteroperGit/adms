// The butterfly is decorative beside the brand's accessible text.
// @vitest-environment node
import { expect, it } from "vitest";
import Logo from "./Logo.astro";
import { render } from "../../../tests/helpers/render";

it("renders the decorative header asset with dimensions", async () => {
  const body = await render(Logo);
  const image = body.querySelector("img.brand-logo");

  expect(image).toHaveAttribute("src", "/images/butterfly-logo.svg");
  expect(image).toHaveAttribute("width", "64");
  expect(image).toHaveAttribute("height", "64");
  expect(image).toHaveAttribute("alt", "");
  expect(image).toHaveAttribute("aria-hidden", "true");
  expect(image).toHaveClass("header");
});

it("keeps the footer size variant on the same local asset", async () => {
  const body = await render(Logo, { size: "footer" });
  const image = body.querySelector("img.brand-logo");

  expect(image).toHaveAttribute("src", "/images/butterfly-logo.svg");
  expect(image).toHaveClass("brand-logo", "footer");
  expect(image).toHaveAttribute("alt", "");
});
