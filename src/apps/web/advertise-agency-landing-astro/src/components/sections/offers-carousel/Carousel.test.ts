// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./Carousel.astro";
import { render } from "../../../../tests/helpers/render";

const presentation = {
  fontSizeRem: 1.25,
  textColor: "#ffffff",
  overlay: "dark" as const,
  horizontal: "left" as const,
  vertical: "bottom" as const,
  focalPoint: { x: 50, y: 50 },
};
const items = [
  {
    id: 1,
    image: "/one.webp",
    imageAlt: "First",
    imageWidth: 800,
    imageHeight: 600,
    enabled: true,
    description: "First offer caption",
    href: "/#contacts",
    linkLabel: "Discuss this offer",
    presentation,
  },
  {
    id: 2,
    image: "/two.webp",
    imageAlt: "Second",
    imageWidth: 800,
    imageHeight: 600,
    enabled: true,
    description: "Second offer caption",
    href: "/#contacts",
    linkLabel: "Discuss this offer",
    presentation,
  },
  {
    id: 3,
    image: "/three.webp",
    imageAlt: "Third",
    imageWidth: 800,
    imageHeight: 600,
    enabled: true,
    description: "Third offer caption",
    href: "/#contacts",
    linkLabel: "Discuss this offer",
    presentation,
  },
];

it("renders complete cards in five cyclic track slots", async () => {
  const body = await render(Component, { items, options: {} });
  const slots = body.querySelectorAll(".offers-track-slot");

  expect(body.querySelector("#offers-carousel")).toHaveAttribute(
    "role",
    "region",
  );
  expect(slots).toHaveLength(5);
  expect(slots[0]).toHaveAttribute("data-track-offset", "-2");
  expect(slots[2]).toHaveAttribute("data-track-offset", "0");
  expect(slots[4]).toHaveAttribute("data-track-offset", "2");
  expect(slots[0].querySelector("[data-track-index='1']")).toHaveProperty(
    "hidden",
    false,
  );
  expect(slots[2].querySelector("[data-track-index='0']")).toHaveProperty(
    "hidden",
    false,
  );
  expect(slots[4].querySelector("[data-track-index='2']")).toHaveProperty(
    "hidden",
    false,
  );
  expect(slots[2]).not.toHaveAttribute("aria-hidden");
  expect(slots[2]).not.toHaveAttribute("inert");
  expect(
    body.querySelectorAll(".offers-track-slot[aria-hidden='true'][inert]"),
  ).toHaveLength(4);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(15);
  expect(body.querySelectorAll(".offers-track-link")).toHaveLength(15);
});

it("shows the same neighbor on both sides of a two-item track", async () => {
  const body = await render(Component, {
    items: items.slice(0, 2),
    options: {},
  });

  expect(body.querySelectorAll(".offers-track-slot")).toHaveLength(5);
  expect(
    body.querySelectorAll(".offers-track [data-track-index='1']:not([hidden])"),
  ).toHaveLength(2);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(10);
});

it("renders one full-width card without neighbor slots", async () => {
  const body = await render(Component, {
    items: items.slice(0, 1),
    options: {},
  });

  expect(body.querySelector("offers-image-carousel")).toHaveAttribute(
    "data-single",
    "true",
  );
  expect(body.querySelectorAll(".offers-track-slot")).toHaveLength(1);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(1);
});

it("renders no carousel for an empty item list", async () => {
  const body = await render(Component, { items: [], options: {} });

  expect(body.querySelector("offers-image-carousel")).toBeNull();
});
