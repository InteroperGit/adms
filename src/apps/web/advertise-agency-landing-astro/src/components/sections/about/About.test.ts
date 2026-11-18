// @vitest-environment node
import { expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./About.astro";
import { render } from "../../../../tests/helpers/render";

it("renders agency copy, actions and supplied statistics", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll("#about dl dt")).not.toHaveLength(0);
  expect(body.querySelectorAll("#about dl dd")).not.toHaveLength(0);
  expect(body.querySelectorAll(".opening-actions a")).toHaveLength(1);
  expect(body.querySelector(".opening-actions a")).toHaveAttribute(
    "href",
    "/#contacts",
  );
});

it.each([
  {
    name: "disabled",
    options: { enabled: false },
    items: [{ enabled: true }],
  },
  {
    name: "empty",
    options: { enabled: true },
    items: [],
  },
])(
  "uses the full text width when carousel content is $name",
  async ({ options, items }) => {
    vi.doMock("@/content/aboutCarousel", () => ({
      aboutCarousel: { options, items },
    }));
    vi.resetModules();

    try {
      const { default: AboutWithoutImages } = await import("./About.astro");
      const body = await render(AboutWithoutImages, {});
      const row = body.querySelector(".opening-row");

      expect(row).not.toHaveClass("opening-with-images");
      expect(row?.querySelector(".opening-media")).toBeNull();
    } finally {
      vi.doUnmock("@/content/aboutCarousel");
      vi.resetModules();
    }
  },
);
