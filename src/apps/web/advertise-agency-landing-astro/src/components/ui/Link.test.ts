// Link keeps native anchor behavior and forwards attributes and slot content.
// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Link from "./Link.astro";
import { render } from "../../../tests/helpers/render";

it("forwards native attributes, classes, and slot content", async () => {
  const body = await render(
    Link,
    {
      href: "/contact/",
      class: "custom-link",
      target: "_blank",
      rel: "noopener",
      "aria-label": "Contact us",
      "data-action": "contact",
    },
    { default: "Contact" },
  );
  const link = getByRole(body, "link", { name: "Contact us" });

  expect(link).toHaveAttribute("href", "/contact/");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener");
  expect(link).toHaveAttribute("data-action", "contact");
  expect(link).toHaveClass("custom-link");
  expect(link).toHaveAttribute("data-link-underline", "true");
  expect(link).toHaveTextContent("Contact");
});

it("supports the underline opt-out", async () => {
  const body = await render(
    Link,
    { href: "/", underline: false, class: "brand-link" },
    { default: "Home" },
  );
  const link = getByRole(body, "link", { name: "Home" });

  expect(link).toHaveAttribute("href", "/");
  expect(link).toHaveAttribute("data-link-underline", "false");
  expect(link).toHaveClass("brand-link");
});

it("preserves anchors without an href value", async () => {
  const body = await render(Link, { href: undefined, "aria-disabled": "true" });
  const link = body.querySelector("a");

  expect(link).not.toHaveAttribute("href");
  expect(link).toHaveAttribute("aria-disabled", "true");
});
