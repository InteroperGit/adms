// @vitest-environment node
import { expect, it } from "vitest";
import Button from "@/components/ui/Button.astro";
import Component from "./CardCarousel.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders caller cards in an accessible scroll region", async () => {
  const body = await render(Component, {
    Item: Button,
    items: [{ href: "/first", "aria-label": "First" }, { href: "/second" }],
    label: "Guarantees",
  });
  const region = body.querySelector(".card-carousel");
  const controls = body.querySelector(".card-carousel-controls");

  expect(region).toHaveAttribute("role", "region");
  expect(region).toHaveAttribute("aria-label", "Guarantees");
  expect(region).toHaveAttribute("aria-roledescription", "карусель");
  expect(body.querySelector(".card-carousel-viewport")).toHaveAttribute(
    "tabindex",
    "0",
  );
  expect(body.querySelectorAll(".card-carousel-track > a")).toHaveLength(2);
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
    render(Component, {
      Item: Button,
      items: [{ href: "/first" }],
      label: " ",
    }),
  ).rejects.toThrow("CardCarousel needs an accessible label");
});

it("requires at least one item", async () => {
  await expect(
    render(Component, { Item: Button, items: [], label: "Cards" }),
  ).rejects.toThrow("CardCarousel needs at least one item");
});

it("requires an items array", async () => {
  await expect(
    render(Component, { Item: Button, label: "Cards" }),
  ).rejects.toThrow();
});

it("requires an items array", async () => {
  await expect(
    render(Component, { Item: Button, label: "Cards" }),
  ).rejects.toThrow();
});

it("rejects non-object entries in the item array", async () => {
  await expect(
    render(Component, { Item: Button, items: [null], label: "Cards" }),
  ).rejects.toThrow();
});

it("rejects slot markup instead of silently ignoring it", async () => {
  await expect(
    render(
      Component,
      { label: "Cards" },
      { default: "<ol><li>First</li></ol>" },
    ),
  ).rejects.toThrow(
    "CardCarousel accepts items and Item props, not slot cards",
  );
});

it("renders ordered card items as direct list items in the track", async () => {
  const body = await render(Component, {
    Item: Button,
    items: [{ href: "/first" }, { href: "/second" }],
    label: "Ordering process",
    ordered: true,
  });

  expect(body.querySelector(".card-carousel-track")?.tagName).toBe("OL");
  expect(body.querySelectorAll(".card-carousel-track > li > a")).toHaveLength(
    2,
  );
});
