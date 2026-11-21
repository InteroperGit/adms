// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import Component from "./Faq.astro";
import { render } from "../../../../tests/helpers/render";

const visibility = vi.hoisted(() => ({
  demoMode: false,
  approved: false,
}));

vi.mock("@/content/faq", async (importOriginal) => {
  const { faq } = await importOriginal<typeof import("@/content/faq")>();
  const approval = {
    state: "approved",
    source: "fixture",
    approvedBy: "fixture",
  };

  return {
    get faq() {
      return {
        ...faq,
        demoMode: visibility.demoMode,
        approval: visibility.approved ? approval : faq.approval,
        items: visibility.approved
          ? [...faq.items, { ...faq.items[0], id: "approved", approval }]
          : faq.items,
      };
    },
  };
});

afterEach(() => {
  visibility.demoMode = false;
  visibility.approved = false;
});

it("omits the FAQ section when no approved answers are visible", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector("#faq")).toBeNull();
  expect(body.querySelectorAll("details.faq-item")).toHaveLength(0);
});

it("keeps anchors and filters draft answers in production", async () => {
  visibility.approved = true;
  const body = await render(Component);
  const item = body.querySelector("details#faq-approved");

  expect(item).toHaveClass("faq-item");
  expect(item?.querySelector("summary")).toHaveTextContent("TEST_QUESTION");
  expect(item?.querySelector(".faq-answer")).toHaveTextContent("TEST_ANSWER");
  expect(body.querySelector("#faq-sample")).toBeNull();
  expect(body.querySelector(".faq-notice")).toBeNull();
});

it("shows draft answers and the notice in explicit demo mode", async () => {
  visibility.demoMode = true;
  const body = await render(Component);

  expect(body.querySelector("details#faq-sample")).toBeInTheDocument();
  expect(body.querySelector(".faq-notice")).toHaveTextContent(
    "TEST_DEMONOTICE",
  );
  expect(body.querySelector(".faq-inquiry a")).toHaveClass(
    "btn-primary",
    "btn-lg",
  );
});
