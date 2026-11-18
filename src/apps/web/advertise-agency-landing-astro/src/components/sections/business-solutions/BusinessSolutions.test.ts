// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
// prettier-ignore
import fixture
  from "@/../tests/fixtures/content/site/sections/businessSolutions.json";
import { businessSolutionsSchema } from "@/validation/businessSolutions";
import Component from "./BusinessSolutions.astro";
import { render } from "../../../../tests/helpers/render";

const businessSolutions = businessSolutionsSchema.parse(fixture);

it("renders ordered solutions, captions and inquiry actions", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll(".solution-item")).not.toHaveLength(0);
  expect(body.querySelectorAll(".solution-gallery figcaption").length).toBe(
    body.querySelectorAll(".solution-item").length,
  );
  expect(body.querySelectorAll(".solution-inquiry")).not.toHaveLength(0);
  const ids = [...body.querySelectorAll(".solution-item")].map(
    (item) => item.querySelector("h3")?.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toEqual(
    businessSolutions.items.map((item) => `solution-${item.id}`),
  );
});
