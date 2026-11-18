// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./InquiryCaptcha.astro";
import { render } from "../../../../../tests/helpers/render";

it("keeps the CAPTCHA hook without a site key", async () => {
  const body = await render(Component, { siteKey: "" });
  const captcha = body.querySelector("[data-smartcaptcha]")!;

  expect(captcha).toHaveAttribute("data-sitekey", "");
  expect(captcha).toHaveAttribute("role", "group");
  expect(captcha).toHaveAttribute("tabindex", "-1");
});
