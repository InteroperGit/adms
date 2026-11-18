// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./InquiryConsent.astro";
import { orderInquiry } from "@/content/orderInquiry";
import { render } from "../../../../../tests/helpers/render";

it("keeps consent required and linked to privacy policy", async () => {
  const body = await render(Component, { content: orderInquiry });

  expect(body.querySelector('[name="consent"]')).toBeRequired();
  expect(body.querySelector("#inquiry-consent-error")).toHaveAttribute(
    "hidden",
  );
  expect(body.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
});
