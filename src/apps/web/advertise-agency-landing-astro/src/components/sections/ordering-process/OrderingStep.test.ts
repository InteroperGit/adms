// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OrderingStep.astro";
import { orderingProcess } from "@/content/orderingProcess";
import { render } from "../../../../tests/helpers/render";

it("renders a numbered list item with its configured heading", async () => {
  const step = orderingProcess.steps[0];
  const body = await render(Component, { step, number: 1 });
  const item = body.querySelector(":scope > li")!;

  expect(item.querySelector("article")).toHaveAttribute("tabindex", "0");
  expect(item.querySelector(".ordering-step-number")).toHaveTextContent("01");
  expect(item.querySelector("h3")).toHaveTextContent(step.title);
  expect(item.querySelectorAll(".ordering-responsibilities ul")).toHaveLength(
    2,
  );
});
