// Static HTML composition; browser scripts remain covered by E2E.
// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
// prettier-ignore
import ProjectCatalogControls
  from '../../src/components/projects/ProjectCatalogControls.astro';
// prettier-ignore
import ProjectCatalogCount
  from '../../src/components/projects/ProjectCatalogCount.astro';
// prettier-ignore
import ProjectCatalogGrid
  from '../../src/components/projects/ProjectCatalogGrid.astro';
// prettier-ignore
import ProjectCatalogEmpty
  from '../../src/components/projects/ProjectCatalogEmpty.astro';
// prettier-ignore
import ProjectCatalogPagination
  from '../../src/components/projects/ProjectCatalogPagination.astro';
import type { ContentBlock } from "../../src/types/content-blocks";
import type { Project } from "../../src/types/project";
import ProjectsIndex from "../../src/pages/projects/index.astro";
import ProjectPage from "../../src/pages/projects/page/[page].astro";
import { site } from "../../src/content/site";
import { render, renderDocument } from "../helpers/render";
import { buildProject, cloneFixture } from "../helpers/fixtures";
import routeFixture from "../fixtures/content/page-routes.json";
import {
  expectPage,
  expectMetadata,
  expectCanonical,
} from "../helpers/page-contract";

const overrides = vi.hoisted(() => ({
  projects: undefined as Project[] | undefined,
}));

vi.mock("@/content/projects", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/projects")>();
  const { getAvailableProjectCategories } =
    await import("../../src/content/project-publication");
  return {
    ...actual,
    get projects() {
      return overrides.projects ?? actual.projects;
    },
    get availableProjectCategories() {
      return getAvailableProjectCategories(
        overrides.projects ?? actual.projects,
      );
    },
  };
});

beforeEach(() => {
  overrides.projects = undefined;
});

it("composes catalog controls, results and pagination", async () => {
  const project: Project = {
    id: 1,
    category: "sample",
    status: "published",
    title: "Fixture project",
    client: "Fixture client",
    attribution: "generic",
    description: "Fixture description",
    content: [],
  };
  const body = await render(ProjectCatalogControls, {
    categories: [
      {
        slug: "sample",
        label: "Sample",
        color: "#000000",
        textColor: "#ffffff",
      },
    ],
  });
  const count = await render(ProjectCatalogCount, { count: 1 });
  const grid = await render(ProjectCatalogGrid, {
    projects: [project],
    page: 1,
    pageSize: 12,
  });
  const empty = await render(ProjectCatalogEmpty, { type: "search" });
  const pagination = await render(ProjectCatalogPagination, {
    items: [1, 2],
    currentPage: 1,
    pageCount: 2,
    pageSize: 1,
    pageHref: (page: number) => `/projects/?page=${page}`,
  });

  expect(body.querySelector("[data-catalog-controls]")).toBeInTheDocument();
  expect(count.querySelector("[data-catalog-count]")).toBeInTheDocument();
  expect(grid.querySelector("[data-project-card]")).toBeInTheDocument();
  expect(
    empty.querySelector("[data-catalog-search-empty]"),
  ).toBeInTheDocument();
  expect(
    pagination.querySelector("[data-catalog-pagination]"),
  ).toBeInTheDocument();
});

function catalogProjects(count = 3): Project[] {
  return Array.from({ length: count }, (_, index) =>
    buildProject({
      id: index + 1,
      title: `Route project ${index + 1}`,
      status: index === 1 ? "demo" : "published",
      content: cloneFixture(routeFixture.publishedBlocks) as ContentBlock[],
    }),
  );
}

const catalogRoutes = [
  { component: ProjectsIndex, path: "/projects/", page: 1 },
  { component: ProjectPage, path: "/projects/page/2/", page: 2 },
];

it.each(catalogRoutes)(
  "renders catalog $path with native page links",
  async ({ component, path, page }) => {
    overrides.projects = catalogProjects();
    const document = await renderDocument(component, {
      url:
        `https://request.test${path}?q=sign&category=sample` +
        `${page === 2 ? "&page=99" : ""}#results`,
      params: page === 2 ? { page: "2" } : {},
      site: "https://production.test/",
    });
    expectPage(document);
    expectMetadata(
      document,
      `Проекты | ${site.logoText}`,
      "Каталог проектов наружной рекламы и световых конструкций.",
    );
    expectCanonical(document, path);
    // A numbered path wins over a conflicting legacy page query.
    const current = page;
    const cards = [...document.querySelectorAll("[data-project-card]")];
    expect(cards).toHaveLength(3);
    expect(cards.filter((card) => !card.hasAttribute("hidden"))).toHaveLength(
      1,
    );
    expect(
      document.querySelector("[data-project-card]:not([hidden]) h3"),
    ).toHaveTextContent(`Route project ${current}`);
    expect(
      [...document.querySelectorAll("[data-project-link]")].map((link) =>
        link.getAttribute("href"),
      ),
    ).toEqual(["/projects/1/", "/projects/2/", "/projects/3/"]);
    expect(
      document.querySelector("[data-catalog-controls]"),
    ).toBeInTheDocument();
    expect(document.querySelector("[data-catalog-count]")).toHaveTextContent(
      "3",
    );
    expect(
      document.querySelector('[data-catalog-pagination] [aria-current="page"]'),
    ).toHaveTextContent(String(current));
    const pagination = document.querySelector("[data-catalog-pagination]")!;
    expect(pagination).not.toHaveAttribute("hidden");
    expect(
      pagination.querySelector('a[aria-label="First page"]'),
    ).toHaveAttribute("href", "/projects/?q=sign&category=sample#results");
    expect(
      pagination.querySelector('a[aria-label="Last page"]'),
    ).toHaveAttribute(
      "href",
      "/projects/page/3/?q=sign&category=sample#results",
    );
    expect(
      pagination.querySelector('a[aria-label="Next page"]'),
    ).toHaveAttribute(
      "href",
      "/projects/page/" + `${current + 1}/?q=sign&category=sample#results`,
    );
  },
);

it.each(catalogRoutes)(
  "keeps empty catalog $path readable",
  async ({ component, path }) => {
    overrides.projects = [];
    const document = await renderDocument(component, {
      url: `https://request.test${path}`,
      params: { page: "2" },
    });
    expectPage(document);
    expect(document.querySelector("[data-project-card]")).toBeNull();
    expect(document.querySelector(".catalog-empty")).toBeInTheDocument();
    expect(document.querySelector("[data-catalog-count]")).toHaveTextContent(
      "0",
    );
    expect(document.querySelector("[data-catalog-pagination]")).toHaveAttribute(
      "hidden",
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  },
);

it.each([
  { query: "0", current: 1 },
  { query: "-1", current: 1 },
  { query: "invalid", current: 1 },
  { query: "1.5", current: 1 },
  { query: "99", current: 3 },
])(
  "normalizes catalog query page=$query to page $current",
  async ({ query, current }) => {
    overrides.projects = catalogProjects();
    const document = await renderDocument(ProjectsIndex, {
      url: `https://request.test/projects/?page=${query}`,
    });
    expect(
      document.querySelector("[data-project-card]:not([hidden]) h3"),
    ).toHaveTextContent(`Route project ${current}`);
    const edge = current === 1 ? "Previous page" : "Next page";
    expect(document.querySelector(`[aria-label="${edge}"]`)).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
);
