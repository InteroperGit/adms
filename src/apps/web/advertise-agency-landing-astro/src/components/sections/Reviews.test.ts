// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./Reviews.astro";
import { render } from "../../../tests/helpers/render";

const widget = vi.hoisted(() => ({ enabled: false }));

vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();

  return {
    get site() {
      return {
        ...actual.site,
        yandexReviews: {
          ...actual.site.yandexReviews,
          enabled: widget.enabled,
        },
      };
    },
  };
});

afterEach(() => {
  widget.enabled = false;
});

it("renders the configured provider and section heading", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(body.querySelector(".yandex-reviews")).toBeInTheDocument();
  expect(
    body.querySelector(".yandex-reviews-frame, .yandex-reviews-placeholder"),
  ).toBeInTheDocument();
  expect(body.querySelector(".yandex-reviews-placeholder")).toBeInTheDocument();
});

it("uses the configured provider when enabled", async () => {
  widget.enabled = true;
  const body = await render(Component, {});

  expect(body.querySelector("#reviews")).toBeInTheDocument();
  expect(
    body.querySelector(".yandex-reviews-frame")?.getAttribute("src"),
  ).toMatch(/maps-reviews-widget\/\d+\?comments$/);
  expect(body.querySelector(".yandex-reviews-placeholder")).toBeNull();
  expect(body.querySelector(".yandex-reviews a")?.getAttribute("href")).toMatch(
    /^https:\/\//,
  );
});
