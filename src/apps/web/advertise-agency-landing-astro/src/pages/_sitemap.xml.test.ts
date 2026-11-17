// Sitemap responses use isolated published paths at the route boundary.
// @vitest-environment node
import type { APIContext, APIRoute } from "astro";
import { JSDOM } from "jsdom";
import { beforeEach, expect, it, vi } from "vitest";

const published = vi.hoisted(() => ({
  projects: [] as string[],
  services: [] as string[],
}));

vi.mock("@/content/projects", () => ({ projects: [] }));
vi.mock("@/content/services", () => ({ services: {} }));
vi.mock("@/validation/policies/project-publication", () => ({
  getPublishedProjectPaths: () => published.projects,
}));
vi.mock("@/validation/policies/service-publication", () => ({
  getPublishedServicePaths: () => published.services,
}));

beforeEach(() => {
  vi.resetModules();
  published.projects = [];
  published.services = [];
});

async function loadRoute() {
  const { GET } = await import("./sitemap.xml");
  return GET;
}

function request(handler: APIRoute, site?: URL) {
  return handler({ site } as APIContext);
}

it("returns a valid empty sitemap when no site is configured", async () => {
  published.projects = ["/projects/approved/"];
  const response = await request(await loadRoute());

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "application/xml; charset=utf-8",
  );
  const body = await response.text();
  expect(body).not.toContain("<loc>");
  expect(body).toContain("</urlset>");
  const document = new JSDOM(body, { contentType: "application/xml" }).window
    .document;
  expect(document.documentElement.localName).toBe("urlset");
  expect(document.documentElement.namespaceURI).toBe(
    "http://www.sitemaps.org/schemas/sitemap/0.9",
  );
});

it("resolves approved paths against the configured base origin", async () => {
  published.projects = ["/projects/42/"];
  published.services = ["/services/signs/"];
  const response = await request(
    await loadRoute(),
    new URL("https://example.test/catalog/"),
  );

  expect(response.headers.get("content-type")).toBe(
    "application/xml; charset=utf-8",
  );
  const body = await response.text();
  expect(body).toContain("https://example.test/projects/42/");
  expect(body).toContain("https://example.test/services/signs/");
  expect(body).toContain("https://example.test/");
});

it("escapes published route text as valid XML", async () => {
  published.projects = ["/projects/a&b/"];
  const response = await request(
    await loadRoute(),
    new URL("https://example.test/"),
  );
  const body = await response.text();

  expect(body).toContain("/projects/a&amp;b/");
  const document = new JSDOM(body, { contentType: "application/xml" }).window
    .document;
  expect(document.querySelector("parsererror")).toBeNull();
  expect(
    [...document.querySelectorAll("loc")].map((node) => node.textContent),
  ).toContain("https://example.test/projects/a&b/");
});
