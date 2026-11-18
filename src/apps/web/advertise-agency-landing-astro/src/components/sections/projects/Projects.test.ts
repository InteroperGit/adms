// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./Projects.astro";
import { render } from "../../../../tests/helpers/render";

const collection = vi.hoisted(() => ({ empty: false }));

vi.mock("@/content/projects", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/projects")>();

  return {
    get projects() {
      return collection.empty ? [] : actual.projects;
    },
  };
});

afterEach(() => {
  collection.empty = false;
});

it("shows the first three projects with their named detail links", async () => {
  const body = await render(Component, {});
  const cards = body.querySelectorAll(".catalog-card");

  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(cards.length).toBeGreaterThan(0);
  expect(cards.length).toBeLessThanOrEqual(3);
  cards.forEach((card) => {
    expect(card.querySelector(".catalog-action")?.getAttribute("href")).toMatch(
      /^\/projects\/\d+\/$/,
    );
  });
  expect(getByRole(body, "link", { name: /все проекты/i })).toHaveAttribute(
    "href",
    "/projects/",
  );
});

it("handles an empty project collection", async () => {
  collection.empty = true;
  const body = await render(Component, {});
  const section = body.querySelector("section#projects")!;

  expect(section).toHaveTextContent("Кейсы пока не опубликованы.");
  expect(section.querySelector(".grid")).toBeNull();
  expect(section.querySelector('a[href="/projects/"]')).toBeInTheDocument();
});
