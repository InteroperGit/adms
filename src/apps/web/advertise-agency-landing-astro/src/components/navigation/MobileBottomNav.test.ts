// Verify the mobile navigation keeps native links and accessible names.
// @vitest-environment node
import { expect, it } from "vitest";
import { getAllByRole, getByRole } from "@testing-library/dom";
import { visibleServices } from "@/content/services";
import Component from "./MobileBottomNav.astro";
import { render } from "../../../tests/helpers/render";

it("renders the available section links as accessible anchors", async () => {
  const body = await render(Component);
  const navigation = getByRole(body, "navigation", {
    name: "Мобильная навигация",
  });
  const links = getAllByRole(navigation, "link");
  const expected = [
    ...(visibleServices.length > 0 ? [["Услуги", "/#services"]] : []),
    ["Проекты", "/#projects"],
    ["Отзывы", "/#reviews"],
    ["Контакты", "/#contacts"],
  ];

  expect(
    links.map((link) => [link.textContent?.trim(), link.getAttribute("href")]),
  ).toEqual(expected);
  expect(links.every((link) => link.tagName === "A")).toBe(true);
  expect(
    links.every(
      (link) =>
        link.querySelector("svg")?.getAttribute("aria-hidden") === "true",
    ),
  ).toBe(true);
});
