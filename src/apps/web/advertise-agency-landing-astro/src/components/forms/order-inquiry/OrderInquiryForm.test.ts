// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OrderInquiryForm.astro";
import { orderInquiry } from "@/content/orderInquiry";
import { render } from "../../../../tests/helpers/render";

it("keeps delivery disabled and provides live and no-JS feedback", async () => {
  const body = await render(Component, { content: orderInquiry });
  const form = body.querySelector("form[data-inquiry]")!;

  expect(form).toHaveAttribute("method", "post");
  expect(form).toHaveAttribute("data-enabled", "false");
  expect(form.querySelector('[type="submit"]')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveAttribute(
    "aria-live",
    "polite",
  );
  expect(form.querySelector("noscript")).toHaveTextContent("JavaScript");
});
