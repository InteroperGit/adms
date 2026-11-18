// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./HeaderMenuOpener.astro";
import { render } from "../../../../tests/helpers/render";

it("renders an accessible menu trigger with both state icons", async () => {
  const body = await render(Component);
  const button = getByRole(body, "button");

  expect(button).toHaveAccessibleName();
  expect(button).toHaveAttribute("type", "button");
  expect(button).toHaveAttribute("id", "mobile-menu-open");
  expect(button).toHaveAttribute("aria-controls", "mobile-menu");
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(button).toHaveAttribute("aria-haspopup", "dialog");
  expect(button.querySelector(".lucide-menu")).not.toBeNull();
  expect(button.querySelector(".lucide-x")).not.toBeNull();
  expect(button.querySelector("[aria-hidden='true']")).not.toBeNull();
});
