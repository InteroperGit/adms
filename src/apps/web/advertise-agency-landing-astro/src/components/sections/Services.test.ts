// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./Services.astro";
import { render } from "../../../tests/helpers/render";

const defaults = vi.hoisted(() => ({ demoMode: false }));

vi.mock("@/content/services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/services")>();

  return {
    get services() {
      return { ...actual.services, demoMode: defaults.demoMode };
    },
    visibleServices: actual.visibleServices,
  };
});

afterEach(() => {
  defaults.demoMode = false;
});

it("renders the visible service collection in source order", async () => {
  const body = await render(Component, {
    items: [
      { id: "one", name: "First service", description: "First", href: "/one/" },
      {
        id: "two",
        name: "Second service",
        description: "Second",
        href: "/two/",
      },
    ],
  });
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll(".catalog-card")).toHaveLength(2);
  expect(body.querySelector(".services-demo")).toBeNull();
  expect(body.querySelectorAll(".catalog-title a")[0]).toHaveAttribute(
    "href",
    "/one/",
  );
  expect(body.querySelectorAll(".catalog-title a")[1]).toHaveAttribute(
    "href",
    "/two/",
  );
});

it("omits the section when the supplied collection is empty", async () => {
  const body = await render(Component, { items: [] });
  expect(body.querySelector("section#services")).toBeNull();
});

it("uses defaults and limits notices to demo mode", async () => {
  defaults.demoMode = true;
  const body = await render(Component, {});

  expect(body.querySelectorAll(".catalog-card").length).toBeGreaterThan(0);
  expect(body.querySelector(".services-demo")).toBeInTheDocument();
  expect(body.querySelector("#services")).toHaveAttribute(
    "aria-labelledby",
    "services-heading",
  );
});
