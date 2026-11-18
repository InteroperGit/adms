// Verify both presentation variants keep the shared navigation contract.
// @vitest-environment node
import { expect, it } from "vitest";
import { getAllByRole, getByRole } from "@testing-library/dom";
import Component from "./NavLinks.astro";
import { render } from "../../../tests/helpers/render";

const items = [
  { label: "Услуги", href: "/#services" },
  { label: "Проекты", href: "/projects/" },
];
const phone = "+7 900 123 45 67";
const phoneHref = "tel:+79001234567";

it.each([
  ["desktop", 4, true],
  ["mobile", 2, false],
] as const)(
  "renders the %s navigation with its expected links",
  async (variant, itemCount, hasContactActions) => {
    const body = await render(Component, { items, variant, phone });
    const nav = getByRole(body, "navigation", {
      name: "Основная навигация",
    });
    const links = getAllByRole(nav, "link");
    const buttonLink = links.find(
      (link) => link.getAttribute("href") === phoneHref,
    );

    expect(nav.querySelectorAll("ul")).toHaveLength(1);
    expect(nav.querySelectorAll("li")).toHaveLength(itemCount);
    expect(links.slice(0, 2).map((link) => link.getAttribute("href"))).toEqual(
      items.map((item) => item.href),
    );
    if (hasContactActions) {
      expect(buttonLink).toHaveTextContent(phone);
      expect(buttonLink).toHaveClass("btn-outline", "btn-sm");
      expect(buttonLink).toHaveAttribute("href", phoneHref);

      const maxLink = links.at(-1);
      expect(maxLink).toHaveAttribute("href", "https://max.ru/");
      expect(maxLink).toHaveAttribute("target", "_blank");
      expect(maxLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(maxLink).toHaveAccessibleName("Написать в Макс");
    } else {
      expect(buttonLink).toBeUndefined();
      expect(nav.querySelector('a[href="https://max.ru/"]')).toBeNull();
    }
  },
);

it("leaves mobile contacts to the drawer and escapes item labels", async () => {
  const body = await render(Component, {
    items: [{ label: "<script>alert(1)</script>", href: "/safe/" }],
    variant: "mobile",
    phone,
  });

  expect(body.querySelector("script")).toBeNull();
  expect(body).toHaveTextContent("<script>alert(1)</script>");
  expect(body.querySelectorAll('a[href="https://max.ru/"]')).toHaveLength(0);
  expect(body.querySelector(`a[href="${phoneHref}"]`)).toBeNull();
});
