// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CardCarousel.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders caller cards in an accessible scroll region", async () => {
  const body = await render(
    Component,
    { label: "Guarantees" },
    { default: "<article>First</article><article>Second</article>" },
  );
  const region = body.querySelector(".card-carousel");
  const controls = body.querySelector(".card-carousel-controls");

  expect(region).toHaveAttribute("role", "region");
  expect(region).toHaveAttribute("aria-label", "Guarantees");
  expect(region).toHaveAttribute("aria-roledescription", "карусель");
  expect(body.querySelector(".card-carousel-viewport")).toHaveAttribute(
    "tabindex",
    "0",
  );
  expect(body.querySelectorAll(".card-carousel-track > article")).toHaveLength(
    2,
  );
  expect(controls).toHaveAttribute("hidden");
  expect(body.querySelectorAll(".card-carousel-arrow")).toHaveLength(2);
  expect(body.querySelectorAll(".carousel-control-circle")).toHaveLength(2);
  expect(body.querySelector("[data-direction='-1']")).toHaveAttribute(
    "aria-label",
    "Предыдущие карточки: Guarantees",
  );
});

it("requires a label for the scroll region", async () => {
  await expect(
    render(Component, { label: " " }, { default: "<article>Card</article>" }),
  ).rejects.toThrow("CardCarousel needs an accessible label");
});
