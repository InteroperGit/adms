// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Card from "./Card.astro";
import { render } from "../../../tests/helpers/render";

it("renders slot content in a div by default", async () => {
  const body = await render(Card, {}, { default: "<p>Opening hours</p>" });

  expect(body.firstElementChild?.tagName).toBe("DIV");
  expect(body.firstElementChild).toHaveTextContent("Opening hours");
});

it("forwards classes and attributes to an article", async () => {
  const body = await render(
    Card,
    {
      as: "article",
      class: "custom-card",
      "aria-labelledby": "hours",
      "data-panel": "hours",
    },
    { default: '<h2 id="hours">Opening hours</h2>' },
  );
  const article = getByRole(body, "article", { name: "Opening hours" });

  expect(article).toHaveClass("card-surface", "custom-card");
  expect(article).toHaveAttribute("data-panel", "hours");
});
