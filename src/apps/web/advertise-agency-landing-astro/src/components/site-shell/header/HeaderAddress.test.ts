// Verify the address component preserves its map link and accessible icon.
// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./HeaderAddress.astro";
import { render } from "../../../../tests/helpers/render";

it("renders the address as a link to the contact section", async () => {
  const address = "Main Street, 1";
  const body = await render(Component, { address });
  const link = body.querySelector<HTMLAnchorElement>(".header-address");

  expect(link).toHaveAttribute("href", "/#contacts");
  expect(link).toHaveTextContent(address);
  expect(link?.querySelector(".lucide-map-pin")).not.toBeNull();
});
