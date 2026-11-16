// Static HTML composition; browser scripts remain covered by E2E.
// @vitest-environment node
import { expect, it } from "vitest";
import OrderInquiry from "../../src/components/sections/OrderInquiry.astro";
import OrderFormBlock from "../../src/components/content/OrderFormBlock.astro";
import fixture from "../fixtures/content/content-blocks.json";
import { render } from "../helpers/render";

it("composes disabled inquiry and no-JS fallback", async () => {
  const body = await render(OrderInquiry);

  expect(body.querySelector("#order-inquiry")).toBeInTheDocument();
  expect(body.querySelector("[data-inquiry]")).toHaveAttribute(
    "data-enabled",
    "false",
  );
  expect(body.querySelector("fieldset")).toBeDisabled();
  expect(body.querySelector("noscript")).toHaveTextContent("JavaScript");
});

it("ties published article forms to their owner", async () => {
  const block = {
    type: "order-form",
    id: "led-letters",
    formId: "led-letters",
    context: "service",
    category: "svetovye-bukvy",
    status: "published",
    provenance: { source: "integration fixture" },
  } as const;
  const published = await render(OrderFormBlock, {
    block,
    context: {
      kind: "service",
      serviceId: "svetovye-bukvy",
      category: "svetovye-bukvy",
      published: true,
    },
  });
  const rejected = await render(OrderFormBlock, {
    block,
    context: {
      kind: "service",
      serviceId: "neon",
      category: "neon",
      published: true,
    },
  });

  expect(published.querySelector("section#led-letters")).toBeInTheDocument();
  expect(published.querySelector('input[name="serviceId"]')).toHaveValue(
    "svetovye-bukvy",
  );
  expect(rejected.querySelector("[data-led-letters]")).toBeNull();
  expect(
    rejected.querySelector('a[href="/#order-inquiry"]'),
  ).toBeInTheDocument();
});
