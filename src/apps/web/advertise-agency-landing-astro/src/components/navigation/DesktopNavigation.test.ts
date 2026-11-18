// Verify the dedicated desktop row preserves configured destinations.
// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./DesktopNavigation.astro";
import { render } from "../../../tests/helpers/render";

it("renders supplied destinations in the dedicated row", async () => {
  const items = [
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/projects/" },
  ];
  const body = await render(Component, { items });
  const nav = body.querySelector("nav");

  expect(nav).not.toBeNull();
  expect(nav?.querySelectorAll("li")).toHaveLength(items.length);
  expect(
    [...nav!.querySelectorAll("a")].map((link) => link.getAttribute("href")),
  ).toEqual(items.map((item) => item.href));
});
