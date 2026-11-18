// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OrderInquiry.astro";
import { render } from "../../../tests/helpers/render";

it("composes the inquiry section around its protected form", async () => {
  const body = await render(Component, {});
  const section = body.querySelector("section#order-inquiry")!;
  const form = section.querySelector("form[data-inquiry]")!;

  expect(Component).toBeDefined();
  expect(form).toHaveAttribute("method", "post");
  expect(form.querySelector("fieldset")).toBeDisabled();
  expect(form.querySelector('[type="submit"]')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveAttribute(
    "aria-live",
    "polite",
  );
});
