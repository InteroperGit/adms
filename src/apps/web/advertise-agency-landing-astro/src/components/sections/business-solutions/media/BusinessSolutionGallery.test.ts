// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
// prettier-ignore
import fixture
  from "@/../tests/fixtures/content/site/sections/businessSolutions.json";
import { businessSolutionsSchema } from "@/validation/businessSolutions";
import Component from "./BusinessSolutionGallery.astro";
import { render } from "../../../../../tests/helpers/render";

const carousel = businessSolutionsSchema.parse(fixture).items[0]?.carousel;

if (!carousel) {
  throw new Error("Business solutions fixture needs a carousel");
}

it("renders the labelled carousel and rights caption", async () => {
  const body = await render(Component, {
    solutionId: "solution-a",
    carousel,
  });

  expect(body.querySelector("figure")).toBeInTheDocument();
  expect(body.querySelector("figcaption")).toHaveTextContent(
    carousel.mediaRights,
  );
  expect(body.querySelector("image-carousel")).toBeNull();
});

it("names each enabled carousel from its solution", async () => {
  const enabledCarousel = {
    ...carousel,
    options: { ...carousel.options, enabled: true },
    items: carousel.items.map((item, index) => ({
      ...item,
      enabled: index === 0,
    })),
  };
  const body = await render(Component, {
    solutionId: "solution-b",
    carousel: enabledCarousel,
  });
  const region = getByRole(body, "region", {
    name: carousel.itemLabel,
  });

  expect(region).toHaveAttribute("id", "business-solutions-solution-b");
});
