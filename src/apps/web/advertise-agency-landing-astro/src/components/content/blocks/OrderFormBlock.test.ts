// @vitest-environment node
// Unregistered forms fall back to the general inquiry destination.
import { expect, it } from "vitest";
import OrderFormBlock from "./OrderFormBlock.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a safe inquiry fallback for an unregistered form", async () => {
  const body = await render(OrderFormBlock, {
    block: {
      type: "order-form",
      formId: "unknown",
      context: "service",
    },
  });
  expect(body.querySelector(".inquiry-link")).toHaveAttribute(
    "href",
    "/#order-inquiry",
  );
});

it("renders the registered form for a published project", async () => {
  const body = await render(OrderFormBlock, {
    block: {
      type: "order-form",
      formId: "led-letters",
      context: "project",
      category: "led-letters",
    },
    context: {
      kind: "project",
      projectId: 42,
      category: "led-letters",
      published: true,
    },
  });
  expect(body.querySelector("form[data-led-letters]")).toBeInTheDocument();
  expect(body.querySelector(".inquiry-link")).toBeNull();
  expect(body.querySelector('input[name="projectId"]')).toHaveValue("42");
});

it("uses a fallback for demo blocks with a valid owner", async () => {
  const body = await render(OrderFormBlock, {
    block: {
      type: "order-form",
      formId: "led-letters",
      context: "project",
      category: "led-letters",
      status: "demo",
    },
    context: {
      kind: "project",
      projectId: 42,
      category: "led-letters",
      published: true,
    },
  });
  expect(body.querySelector("form[data-led-letters]")).toBeNull();
  expect(body.querySelector(".inquiry-link")).toHaveAttribute(
    "href",
    "/#order-inquiry",
  );
});
