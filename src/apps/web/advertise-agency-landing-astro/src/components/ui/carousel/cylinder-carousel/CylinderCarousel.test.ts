// @vitest-environment node
import { expect, it } from "vitest";
import Button from "@/components/ui/Button.astro";
import Component from "./CylinderCarousel.astro";
import { render } from "../../../../../tests/helpers/render";

const props = {
  Item: Button,
  items: [{ href: "/one" }, { href: "/two" }],
  label: "Gallery",
  previousLabel: "Previous image",
  nextLabel: "Next image",
  dotsLabel: "Choose image",
  slideLabel: "Show image",
};

it("renders factory items in order inside accessible slides", async () => {
  const body = await render(Component, {
    ...props,
    autoplay: false,
    controls: false,
    dots: false,
  });

  expect(body.querySelector("cylinder-carousel")).toHaveAttribute(
    "aria-label",
    "Gallery",
  );
  expect(body.querySelectorAll("[data-cylinder-slide]")).toHaveLength(2);
  expect(
    [
      ...body.querySelectorAll<HTMLAnchorElement>("[data-cylinder-slide] a"),
    ].map((link) => link.getAttribute("href")),
  ).toEqual(["/one", "/two"]);
  expect(body.querySelector("[data-cylinder-slide]")).not.toHaveAttribute(
    "aria-hidden",
  );
  expect(
    body.querySelectorAll("[data-cylinder-slide][aria-hidden='true']"),
  ).toHaveLength(1);
  expect(body.querySelectorAll("[data-cylinder-slide][inert]")).toHaveLength(1);
  expect(body.querySelector("[data-cylinder-prev]")).toBeNull();
  expect(body.querySelector("[data-cylinder-next]")).toBeNull();
  expect(body.querySelector(".cylinder-dots")).toBeNull();
});

it("renders common controls with a browser-managed dot template", async () => {
  const body = await render(Component, props);

  expect(body.querySelector("[data-cylinder-prev]")).toHaveClass(
    "carousel-control",
    "cylinder-arrow",
  );
  expect(body.querySelector("[data-cylinder-next]")).toHaveClass(
    "carousel-control",
    "cylinder-arrow",
  );
  const template = body.querySelector<HTMLTemplateElement>(
    "[data-cylinder-dot-template]",
  );
  expect(template?.content.querySelector(".carousel-dot")).not.toBeNull();
});

it("requires an Item and nonempty item records", async () => {
  await expect(
    render(Component, { ...props, Item: undefined }),
  ).rejects.toThrow("CylinderCarousel needs an Astro Item component");
  await expect(render(Component, { ...props, Item: {} })).rejects.toThrow(
    "CylinderCarousel needs an Astro Item component",
  );
  await expect(
    render(Component, { ...props, items: undefined }),
  ).rejects.toThrow("CylinderCarousel items are invalid");
  await expect(render(Component, { ...props, items: [] })).rejects.toThrow(
    "CylinderCarousel needs at least one item",
  );
  await expect(render(Component, { ...props, items: [null] })).rejects.toThrow(
    "CylinderCarousel items are invalid",
  );
  await expect(
    render(Component, { ...props, items: "not-an-array" }),
  ).rejects.toThrow("CylinderCarousel items are invalid");
});

it("rejects child slide markup", async () => {
  await expect(
    render(Component, props, { default: "<ol><li>Slide</li></ol>" }),
  ).rejects.toThrow(
    "CylinderCarousel accepts items and Item props, not slide slots",
  );
});
