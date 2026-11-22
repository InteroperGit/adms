// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Section from "./Section.astro";
import { render } from "../../../tests/helpers/render";

it("omits absent heading and subtitle while retaining the slot", async () => {
  const body = await render(Section, {}, { default: "<p>Body</p>" });
  expect(body.querySelector("section")).toHaveClass("bg-base-100");
  expect(body.querySelector("h2")).toBeNull();
  expect(body.querySelector(".site-section-subtitle")).toBeNull();
  expect(body.querySelector(".site-container > p")).toHaveTextContent("Body");
});

it("places a named section heading and subtitle before its slot", async () => {
  const body = await render(
    Section,
    {
      id: "services",
      title: "Services",
      subtitle: "Our work",
      ariaLabel: "Available services",
      class: "custom",
    },
    { default: "<div data-slot>Details</div>" },
  );
  const section = getByRole(body, "region", { name: "Available services" });
  expect(section).toHaveAttribute("id", "services");
  expect(section).toHaveClass("custom");
  expect(getByRole(section, "heading", { level: 2 })).toHaveTextContent(
    "Services",
  );
  expect(section.querySelector("header")).toHaveTextContent("ServicesOur work");
  expect(
    section.querySelector(".site-container > [data-slot]"),
  ).toHaveTextContent("Details");
});

it("renders a trailing action only when supplied", async () => {
  const body = await render(
    Section,
    {
      id: "introduction",
      title: "Main heading",
      subtitle: "Summary",
    },
    {
      default: "<p>Body</p>",
      action: '<a href="/#order-inquiry">Discuss a project</a>',
    },
  );
  const section = body.querySelector("section");
  expect(getByRole(section!, "heading", { level: 2 })).toHaveAttribute(
    "id",
    "introduction-heading",
  );
  expect(section).toHaveAttribute("aria-labelledby", "introduction-heading");
  expect(
    getByRole(section!, "link", { name: "Discuss a project" }),
  ).toHaveAttribute("href", "/#order-inquiry");
  expect(section?.querySelector("header")).toHaveTextContent("Summary");
  expect(body.querySelector(".site-section-action")).toBeNull();
});

it.each([
  ["default", "bg-base-100"],
  ["gradient", "bg-gradient-to-b"],
  ["dark", "bg-base-200"],
  ["none", null],
])("supports background %s without empty copy", async (background, css) => {
  const body = await render(Section, { background, title: "", subtitle: "" });
  const section = body.querySelector("section");
  expect(section).toHaveClass("site-section");
  if (css) expect(section).toHaveClass(css);
  else expect(section).toHaveAttribute("class", "site-section");
  expect(body.querySelector("h2, p")).toBeNull();
});
