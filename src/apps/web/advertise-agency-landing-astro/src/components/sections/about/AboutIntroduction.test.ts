// @vitest-environment node
import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
import Component from "./AboutIntroduction.astro";
import { render } from "../../../../tests/helpers/render";

it("renders agency copy and only configured section actions", async () => {
  const body = await render(Component, {
    description1: "First paragraph",
    description2: "Second paragraph",
    contacts: { href: "/#contacts", label: "Contact us" },
  });

  expect(getByText(body, "First paragraph")).toBeInTheDocument();
  expect(getByText(body, "Second paragraph")).toBeInTheDocument();
  expect(body.querySelectorAll(".opening-actions a")).toHaveLength(1);
  expect(body.querySelector(".opening-actions a")).toHaveAttribute(
    "href",
    "/#contacts",
  );
  expect(body.querySelector('a[href="/#projects"]')).toBeNull();
});

it("renders the projects action with outline styling", async () => {
  const body = await render(Component, {
    description1: "First paragraph",
    description2: "Second paragraph",
    projects: { href: "/#projects", label: "Our projects" },
  });
  const link = body.querySelector('a[href="/#projects"]');

  expect(link).toHaveTextContent("Our projects");
  expect(link).toHaveClass("btn-outline");
});
