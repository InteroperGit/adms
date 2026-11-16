// Static HTML composition; browser scripts remain covered by E2E.
// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
import ContentBlocks from "../../src/components/content/ContentBlocks.astro";
import ServiceArticle from "../../src/components/sections/ServiceArticle.astro";
import fixture from "../fixtures/content/content-blocks.json";
import type { ContentBlock } from "../../src/types/content-blocks";
import type { Project } from "../../src/types/project";
import type { ServicesContent } from "../../src/types/services";
import ProjectDetail from "../../src/pages/projects/[id].astro";
import ServicePage, {
  getStaticPaths as getServiceStaticPaths,
} from "../../src/pages/services/[id].astro";
import { services } from "../../src/content/services";
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
  services: undefined as ServicesContent | undefined,
}));

vi.mock("@/content/services", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/services")>();
  const { getVisibleServices } =
    await import("../../src/content/service-publication");
  return {
    ...actual,
    get services() {
      return overrides.services ?? actual.services;
    },
    get visibleServices() {
      return getVisibleServices(overrides.services ?? actual.services);
    },
  };
});

beforeEach(() => {
  overrides.services = undefined;
});

it("composes service content and fallback actions", async () => {
  const body = await render(ServiceArticle, { serviceId: "neon" });

  expect(body.querySelector("article.service-article")).toBeInTheDocument();
  expect(body.querySelector("h1")).toBeInTheDocument();
  expect(body.querySelector(".content-blocks")).toBeInTheDocument();
  expect(body.querySelector('meta[name="robots"]')).toBeNull();
  expect(body.querySelector('a[href="/#order-inquiry"]')).toBeInTheDocument();
});

it("composes content blocks with ownership and safe fallback", async () => {
  const body = await render(ContentBlocks, {
    blocks: fixture as ContentBlock[],
    context: {
      kind: "project",
      projectId: 1,
      category: "sample",
      published: true,
    },
  });

  expect(body.querySelector(".content-blocks")).toBeInTheDocument();
  expect(body.querySelector("h2")).toBeInTheDocument();
  expect(body.querySelector(".inquiry-link")).toBeInTheDocument();
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelectorAll("ol, ul").length).toBeGreaterThanOrEqual(2);
});

it("keeps empty article streams safe and renderable", async () => {
  const body = await render(ContentBlocks, { blocks: [] });

  expect(body.querySelector(".content-blocks")).toBeInTheDocument();
  expect(body.querySelector(".block-demo-notice")).toBeNull();
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelectorAll(".content-block")).toHaveLength(0);
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

it("renders approved project content and native actions", async () => {
  const project = catalogProjects(1)[0];
  const document = await renderDocument(ProjectDetail, {
    props: { project },
    params: { id: "1" },
    url: "https://request.test/projects/1/?tracking=1",
    site: "https://production.test/",
  });
  expectPage(document);
  expectMetadata(
    document,
    `Route project 1 | ${site.logoText}`,
    project.description,
  );
  expectCanonical(document, "/projects/1/");
  expect(document.querySelector(".project-notice")).toBeNull();
  const article = document.querySelector("main article")!;
  expect(
    [...article.querySelectorAll("h1, h2, .content-blocks p")].map((node) =>
      node.textContent?.trim(),
    ),
  ).toEqual([
    "Route project 1",
    "Approved article topic",
    "Approved article copy",
  ]);
  expect(article.querySelector('a[href="/projects/"]')).toBeInTheDocument();
  expect(article.querySelector('a[href="/#contacts"]')).toBeInTheDocument();
});

it.each(["demo", "empty", "nested-demo"])(
  "renders project edge case %s with publication metadata",
  async (kind) => {
    const content =
      kind === "empty"
        ? []
        : (cloneFixture(routeFixture.demoBlocks) as ContentBlock[]);
    const project = buildProject({
      title: "Edge project",
      status: kind === "nested-demo" ? "published" : "demo",
      date: undefined,
      content,
    });
    const document = await renderDocument(ProjectDetail, {
      props: { project },
      params: { id: String(project.id) },
      url: `https://request.test/projects/${project.id}/`,
    });
    expectPage(document);
    expectMetadata(
      document,
      `Edge project | ${site.logoText}`,
      project.description,
      true,
    );
    expect(document.querySelector(".project-notice")).toBeNull();
    expect(document.querySelector(".project-meta")).toHaveTextContent(
      "Уточняется",
    );
    expect(document.querySelector("main")).not.toHaveTextContent(
      "Withheld draft article copy",
    );
    if (kind === "empty") {
      expect(document.querySelectorAll(".content-block")).toHaveLength(0);
    } else {
      const blocks = document.querySelector(".content-blocks")!;
      expect(blocks).toHaveTextContent("Visible demo article copy");
      expect(blocks).not.toHaveTextContent("Withheld draft article copy");
    }
    expect(
      document.querySelector('main a[href="/projects/"]'),
    ).toBeInTheDocument();
  },
);

const serviceRoutes = [
  { component: ServicePage, id: "montazh" },
  { component: ServicePage, id: "neon" },
  { component: ServicePage, id: "obyomnye-konstruktsii" },
  { component: ServicePage, id: "svetovye-bukvy" },
  { component: ServicePage, id: "vyveski" },
];

it("generates service routes from catalog IDs and passes typed props", () => {
  const paths = getServiceStaticPaths();
  expect(paths.map(({ params }) => params.id)).toEqual(
    services.items.map((service) => service.id),
  );
  expect(paths.every(({ props }) => "service" in props)).toBe(true);
});

function approvedServices() {
  const content = cloneFixture(services);
  content.demoMode = false;
  content.copyApproved = true;
  for (const service of content.items) {
    service.name = `Route service ${service.id}`;
    service.confirmed = true;
    service.copyApproved = true;
    service.image!.approved = true;
    service.article = {
      title: `Article ${service.id}`,
      description: `Summary ${service.id}`,
      approved: true,
      content: cloneFixture(routeFixture.publishedBlocks) as ContentBlock[],
    };
  }
  return content;
}

it.each(serviceRoutes)(
  "renders approved service route $id",
  async ({ component, id }) => {
    overrides.services = approvedServices();
    const document = await renderDocument(component, {
      props: {
        service: overrides.services.items.find((item) => item.id === id),
      },
      url: `https://request.test/services/${id}/?tracking=1`,
      site: "https://production.test/",
    });
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
    );
    expectCanonical(document, `/services/${id}/`);
    expect(document.querySelector("main h1")).toHaveTextContent(
      `Route service ${id}`,
    );
    expect(document.querySelector(".service-demo")).toBeNull();
    expect(
      [
        ...document.querySelectorAll(
          "main h1, main h2, main .content-blocks p",
        ),
      ].map((node) => node.textContent?.trim()),
    ).toEqual([
      `Route service ${id}`,
      "Approved article topic",
      "Approved article copy",
    ]);
    expect(
      document.querySelector('.service-actions a[href="/#order-inquiry"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('.service-actions a[href="/#services"]'),
    ).toHaveTextContent("Все услуги");
  },
);

it.each(serviceRoutes)(
  "renders demo service route $id before its copy",
  async ({ component, id }) => {
    overrides.services = approvedServices();
    const service = overrides.services.items.find((item) => item.id === id)!;
    service.article.content = cloneFixture(
      routeFixture.demoBlocks,
    ) as ContentBlock[];
    const document = await renderDocument(component, {
      props: {
        service: overrides.services.items.find((item) => item.id === id),
      },
      url: `https://request.test/services/${id}/`,
    });
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
      true,
    );
    const notice = document.querySelector(".service-demo")!;
    const blocks = document.querySelector(".content-blocks")!;
    expect(notice).toHaveTextContent(overrides.services.demoNotice);
    expect(notice.compareDocumentPosition(blocks) & 4).toBe(4);
    expect(blocks).toHaveTextContent("Visible demo article copy");
    expect(blocks).not.toHaveTextContent("Withheld draft article copy");
  },
);

it.each(serviceRoutes)(
  "keeps empty service route $id usable",
  async ({ component, id }) => {
    overrides.services = approvedServices();
    overrides.services.copyApproved = false;
    const service = overrides.services.items.find((item) => item.id === id)!;
    service.article.content = [];
    const document = await renderDocument(component, {
      props: { service },
    });
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
      true,
    );
    expect(document.querySelectorAll(".content-block")).toHaveLength(0);
    expect(
      document.querySelector('.service-actions a[href="/"]'),
    ).toHaveTextContent("На главную");
    expect(
      document.querySelector('.service-actions a[href="/#services"]'),
    ).toBeNull();
    expect(
      document.querySelector('.service-actions a[href="/#order-inquiry"]'),
    ).toBeInTheDocument();
  },
);
