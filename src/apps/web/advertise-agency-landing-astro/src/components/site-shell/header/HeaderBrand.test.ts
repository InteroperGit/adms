// Verify the extracted brand stays a single accessible home link.
// @vitest-environment node
import { expect, it } from "vitest";
import { site } from "@/content/site";
import Component from "./HeaderBrand.astro";
import { render } from "../../../../tests/helpers/render";

it("renders the configured brand name and decorative logo", async () => {
  const body = await render(Component);
  const link = body.querySelector(".header-brand");

  expect(link).toHaveAttribute("href", "/");
  expect(link).toHaveTextContent(site.logoText);
  expect(link?.querySelector("img")).toHaveAttribute("alt", "");
});
