// Robots output remains non-indexing until a site origin is configured.
// @vitest-environment node
import type { APIContext, APIRoute } from "astro";
import { expect, it } from "vitest";
import { GET } from "./robots.txt";

function request(handler: APIRoute, site?: URL) {
  return handler({ site } as APIContext);
}

it("disallows crawling when no site origin is configured", async () => {
  const response = await request(GET);

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "text/plain; charset=utf-8",
  );
  expect(await response.text()).toBe("User-agent: *\nDisallow: /\n");
});

it.each([
  ["https://example.test/", "https://example.test/sitemap.xml"],
  ["https://example.test/base/", "https://example.test/base/sitemap.xml"],
])("reports the sitemap origin %#", async (site, sitemap) => {
  const response = await request(GET, new URL(site));

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "text/plain; charset=utf-8",
  );
  expect(await response.text()).toBe(
    `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`,
  );
});
