import { expect } from "vitest";

// Route assertions use the complete document, never a browser script. Check
// the page-owned heading tree independently from shared navigation headings.
export function expectPage(document: Document) {
  expect(document.doctype?.name).toBe("html");
  expect(document.documentElement).toHaveAttribute("lang", "ru");
  expect(document.querySelectorAll("main")).toHaveLength(1);
  expect(document.querySelectorAll("h1")).toHaveLength(1);
  expect(document.querySelectorAll("head title")).toHaveLength(1);
  const landmarks = [...document.body.children].filter((element) =>
    ["HEADER", "MAIN", "FOOTER"].includes(element.tagName),
  );
  expect(landmarks.map((element) => element.tagName)).toEqual([
    "HEADER",
    "MAIN",
    "FOOTER",
  ]);
  expect(document.querySelector("#cookie-banner")).toBeInTheDocument();
  let previous = 0;
  const headings = document.querySelectorAll("main :is(h1,h2,h3,h4,h5,h6)");
  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1));
    expect(level).toBeLessThanOrEqual(previous + 1);
    previous = level;
  }
  expect(document.querySelector("main")).not.toHaveAttribute("hidden");
  expect(document.querySelector('a[href^="javascript:"]')).toBeNull();
}

export function expectMetadata(
  document: Document,
  title: string,
  description: string | RegExp,
  noindex = false,
) {
  const head = document.head;
  const expectedDescription =
    typeof description === "string"
      ? description
      : expect.stringMatching(description);
  expect(document.title).toBe(title);
  expect(head.querySelector('meta[name="description"]')).toHaveAttribute(
    "content",
    expectedDescription,
  );
  for (const property of ["og:title", "twitter:title"]) {
    expect(
      head.querySelector(`[property="${property}"],
      [name="${property}"]`),
    ).toHaveAttribute("content", title);
  }
  for (const property of ["og:description", "twitter:description"]) {
    expect(
      head.querySelector(`[property="${property}"],
      [name="${property}"]`),
    ).toHaveAttribute("content", expectedDescription);
  }
  const robots = head.querySelector('meta[name="robots"]');
  if (noindex) {
    expect(robots).toHaveAttribute("content", "noindex, follow");
  } else {
    expect(robots).toBeNull();
  }
}

export function expectCanonical(document: Document, path: string) {
  const canonical = `https://production.test${path}`;
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(
    1,
  );
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
    "href",
    canonical,
  );
  expect(
    document.head.querySelector('meta[property="og:url"]'),
  ).toHaveAttribute("content", canonical);
}
