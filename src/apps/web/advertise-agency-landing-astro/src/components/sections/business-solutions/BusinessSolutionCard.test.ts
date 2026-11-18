// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole, queryByText } from "@testing-library/dom";
// prettier-ignore
import fixture
  from "@/../tests/fixtures/content/site/sections/businessSolutions.json";
import { businessSolutionsSchema } from "@/validation/businessSolutions";
import Component from "./BusinessSolutionCard.astro";
import { render } from "../../../../tests/helpers/render";

const item = businessSolutionsSchema.parse(fixture).items[0];

if (!item) {
  throw new Error("Business solutions fixture needs an item");
}

it("renders the labelled solution and its inquiry action", async () => {
  const body = await render(Component, { item });
  const article = getByRole(body, "article");
  const heading = getByRole(article, "heading", { level: 3 });
  const action = article.querySelector(".solution-inquiry");

  expect(heading).toHaveAttribute("id", `solution-${item.id}`);
  expect(article).toHaveAttribute("aria-labelledby", heading.id);
  expect(action).toHaveAccessibleName(item.inquiryLabel);
  expect(action).toHaveAttribute("href", item.inquiryHref);
});

it("requires name and evidence for customer attribution", async () => {
  const withoutEvidence = {
    ...item,
    attribution: { ...item.attribution, customerName: "Client" },
  };
  const incompleteBody = await render(Component, { item: withoutEvidence });

  expect(
    queryByText(incompleteBody, /Реализовано для: Client/),
  ).not.toBeInTheDocument();

  const withEvidence = {
    ...item,
    attribution: {
      ...item.attribution,
      customerName: "Client",
      evidence: "Approved project evidence",
      href: "/projects/1/",
    },
  };
  const completeBody = await render(Component, { item: withEvidence });
  const attributionLink = getByRole(completeBody, "link", {
    name: "Смотреть проект",
  });

  expect(completeBody).toHaveTextContent("Approved project evidence");
  expect(attributionLink).toHaveAttribute("href", "/projects/1/");
});
