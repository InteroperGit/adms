// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Card from "./Card.astro";
import type { ContentImage } from "@/types/content-blocks";
import { render } from "../../../tests/helpers/render";

const baseProps = {
  title: "Sample project",
  titleId: "sample-project-title",
  description: "A concise project summary.",
};

const image: ContentImage = {
  src: "/sample-project.webp",
  alt: "Illuminated storefront sign",
  width: 800,
  height: 600,
  caption: "Storefront at night",
};

it("renders accessible text-only content", async () => {
  const body = await render(Card, baseProps);
  const article = getByRole(body, "article", {
    name: baseProps.title,
  });
  const heading = getByRole(article, "heading", { level: 3 });

  expect(heading).toHaveAttribute("id", baseProps.titleId);
  expect(heading).toHaveTextContent(baseProps.title);
  expect(article).toHaveAttribute("aria-labelledby", baseProps.titleId);
  expect(article).toHaveTextContent(baseProps.description);
  expect(article.querySelector("a, img, .content-media-frame")).toBeNull();
  expect(article.querySelector(".catalog-category")).toBeNull();
  expect(article.querySelector(".catalog-client")).toBeNull();
});

it("renders optional image, category colors and metadata", async () => {
  const body = await render(Card, {
    ...baseProps,
    image,
    category: {
      label: "Retail",
      color: "#123456",
      textColor: "#ffffff",
    },
    metadata: "Northstar, October 2026",
  });
  const photo = getByRole(body, "img", { name: image.alt });
  const category = body.querySelector(".catalog-category");

  expect(photo).toHaveAttribute("src", image.src);
  expect(photo).toHaveAttribute("width", String(image.width));
  expect(photo).toHaveAttribute("height", String(image.height));
  expect(photo).toHaveAttribute("loading", "lazy");
  expect(photo.parentElement).toHaveClass("content-media-service");
  expect(category).toHaveTextContent("Retail");
  expect(category).toHaveStyle(
    "--category-background: #123456; --category-text: #ffffff",
  );
  expect(body.querySelector(".catalog-client")).toHaveTextContent(
    "Northstar, October 2026",
  );
});

it("renders linked titles and project actions", async () => {
  const body = await render(Card, {
    ...baseProps,
    href: "/projects/sample/",
    actionLabel: "View project",
    actionName: "View Sample project case study",
    projectLink: true,
  });
  const heading = getByRole(body, "heading", { level: 3 });
  const titleLink = getByRole(heading, "link", {
    name: baseProps.title,
  });
  const action = getByRole(body, "link", {
    name: "View Sample project case study",
  });

  expect(titleLink).toHaveAttribute("href", "/projects/sample/");
  expect(titleLink).toHaveAttribute("data-link-underline", "false");
  expect(action).toHaveAttribute("href", "/projects/sample/");
  expect(action).toHaveTextContent("View project");
  expect(action).toHaveAttribute("data-project-link");
});

it("keeps an unmarked action for ordinary linked content", async () => {
  const body = await render(Card, {
    ...baseProps,
    href: "/services/sample/",
    projectLink: false,
  });
  const action = getByRole(body, "link", {
    name: `Подробнее: ${baseProps.title}`,
  });

  expect(action).toHaveAttribute("href", "/services/sample/");
  expect(action).not.toHaveAttribute("data-project-link");
});
