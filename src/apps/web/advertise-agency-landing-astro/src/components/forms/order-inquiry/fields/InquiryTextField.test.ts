// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./InquiryTextField.astro";
import { orderInquiry } from "@/content/orderInquiry";
import { render } from "../../../../../tests/helpers/render";

it("associates textarea label, hint and error IDs", async () => {
  const body = await render(Component, {
    name: "message",
    field: orderInquiry.fields.message,
  });

  expect(
    body.querySelector('label[for="inquiry-message"]'),
  ).toBeInTheDocument();
  expect(body.querySelector("textarea#inquiry-message")).toBeRequired();
  expect(body.querySelector("#inquiry-message-hint")).toHaveTextContent(
    orderInquiry.fields.message.hint,
  );
  expect(body.querySelector("#inquiry-message-error")).toHaveAttribute(
    "hidden",
  );
});
