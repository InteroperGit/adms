// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./FaqItem.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a closed native disclosure with a stable FAQ ID", async () => {
  const body = await render(Component, {
    item: {
      id: "delivery",
      question: "How does delivery work?",
      answer: "We agree on delivery for each project.",
      approval: {
        state: "approved",
        source: null,
        approvedBy: null,
      },
    },
  });
  const details = body.querySelector("details");

  expect(details).toHaveAttribute("id", "faq-delivery");
  expect(details).not.toHaveAttribute("open");
  expect(getByRole(body, "group")).toBeInTheDocument();
  expect(body.querySelector("summary")).toHaveTextContent(
    "How does delivery work?",
  );
  expect(body.querySelector(".faq-answer")).toHaveTextContent(
    "We agree on delivery for each project.",
  );
});
