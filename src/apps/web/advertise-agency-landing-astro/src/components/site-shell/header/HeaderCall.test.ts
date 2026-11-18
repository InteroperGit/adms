// Verify the call component keeps its phone link and accessible icon.
// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./HeaderCall.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a direct call link with the supplied phone number", async () => {
  const phone = "+7 900 123-45-67";
  const body = await render(Component, { phone });
  const link = body.querySelector<HTMLAnchorElement>(".header-call");

  expect(link).toHaveAttribute("href", "tel:+7900123-45-67");
  expect(link).toHaveAttribute("aria-label", `Позвонить: ${phone}`);
  expect(link).toHaveTextContent(phone);
  expect(link?.querySelector(".header-call-icon .lucide-phone")).not.toBeNull();
});
