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
  ["desktop", "outline", "sm", phone],
  ["mobile", "primary", "md", "Позвонить"],
] as const)(
  "renders the %s navigation with one ordered list and contact actions",
  async (variant, phoneVariant, phoneSize, phoneLabel) => {
    const body = await render(Component, { items, variant, phone });
    const nav = getByRole(body, "navigation", {
      name: "Основная навигация",
    });
    const links = getAllByRole(nav, "link");
    const buttonLink = links.find(
      (link) => link.getAttribute("href") === phoneHref,
    );

    expect(nav.querySelectorAll("ul")).toHaveLength(1);
    expect(nav.querySelectorAll("li")).toHaveLength(4);
    expect(links.slice(0, 2).map((link) => link.getAttribute("href"))).toEqual(
      items.map((item) => item.href),
    );
    expect(buttonLink).toHaveTextContent(phoneLabel);
    expect(buttonLink).toHaveClass(`btn-${phoneVariant}`, `btn-${phoneSize}`);
    expect(buttonLink).toHaveAttribute("href", phoneHref);

    const maxLink = links.at(-1);
    expect(maxLink).toHaveAttribute("href", "https://max.ru/");
    expect(maxLink).toHaveAttribute("target", "_blank");
    expect(maxLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(maxLink).toHaveAccessibleName("Написать в Макс");
  },
);

it("keeps contact actions and escapes item labels", async () => {
  const body = await render(Component, {
    items: [{ label: "<script>alert(1)</script>", href: "/safe/" }],
    variant: "mobile",
    phone,
  });

  expect(body.querySelector("script")).toBeNull();
  expect(body).toHaveTextContent("<script>alert(1)</script>");
  expect(body.querySelectorAll('a[href="https://max.ru/"]')).toHaveLength(1);
  expect(body.querySelector(`a[href="${phoneHref}"]`)).not.toBeNull();
});
