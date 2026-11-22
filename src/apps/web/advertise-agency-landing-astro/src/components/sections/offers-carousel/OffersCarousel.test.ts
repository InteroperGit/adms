// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import Component from "./OffersCarousel.astro";
import { render } from "../../../../tests/helpers/render";

const visibility = vi.hoisted(() => ({ enabled: true }));

vi.mock("@/content/offers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/offers")>();

  return {
    get offers() {
      return { ...actual.offers, enabled: visibility.enabled };
    },
    enabledOffers: actual.enabledOffers,
  };
});

afterEach(() => {
  visibility.enabled = true;
});

it("renders enabled offers through the feature carousel", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector("section#offers")).toBeInTheDocument();
  expect(body.querySelector("#offers .site-container")).toBeNull();
  expect(
    body.querySelector('cylinder-carousel[role="region"]'),
  ).toBeInTheDocument();
  expect(body.querySelectorAll("[data-cylinder-slide]")).toHaveLength(3);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(3);
  expect(body.querySelectorAll(".cylinder-arrow")).toHaveLength(2);
});

it("omits the section when offers are disabled", async () => {
  visibility.enabled = false;
  const body = await render(Component, {});

  expect(body.querySelector("section#offers")).toBeNull();
});
