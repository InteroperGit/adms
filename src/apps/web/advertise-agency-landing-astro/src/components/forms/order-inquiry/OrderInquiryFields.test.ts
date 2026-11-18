// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OrderInquiryFields.astro";
import { orderInquiry } from "@/content/orderInquiry";
import { render } from "../../../../tests/helpers/render";

it("preserves protected control names and descriptions", async () => {
  const body = await render(Component, { content: orderInquiry });
  const fieldset = body.querySelector("fieldset")!;

  expect(fieldset).toBeDisabled();
  expect(fieldset.querySelectorAll("input, textarea")).toHaveLength(5);
  expect(fieldset.querySelector('[name="email"]')).toHaveAttribute(
    "autocomplete",
    "email",
  );
  expect(fieldset.querySelector('[name="message"]')).toHaveAttribute(
    "aria-describedby",
    "inquiry-message-hint inquiry-message-error",
  );
  expect(fieldset.querySelector("[data-smartcaptcha]")).toBeInTheDocument();
  expect(fieldset.querySelector('[name="consent"]')).toBeRequired();
});
