// Static HTML composition; browser scripts remain covered by E2E.
// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Header from "../../src/components/Header.astro";
import Homepage from "../../src/pages/index.astro";
import CookieBanner from "../../src/components/CookieBanner.astro";
import fixture from "../fixtures/content/content-blocks.json";
import type { ServicesContent } from "../../src/types/services";
import type { LegalDocument } from "../../src/types/legal";
import Layout from "../../src/layouts/Layout.astro";
import LegalLayout from "../../src/layouts/LegalLayout.astro";
import NotFound from "../../src/pages/404.astro";
import Privacy from "../../src/pages/privacy-policy.astro";
import Terms from "../../src/pages/terms-of-use.astro";
import { services } from "../../src/content/services";
import { site } from "../../src/content/site";
import { privacyPolicy, termsOfUse } from "../../src/content/legal";
import { render, renderDocument } from "../helpers/render";
import routeFixture from "../fixtures/content/page-routes.json";
import {
  expectPage,
  expectMetadata,
  expectCanonical,
} from "../helpers/page-contract";

const overrides = vi.hoisted(() => ({
  services: undefined as ServicesContent | undefined,
  legal: undefined as LegalDocument | undefined,
  hideOffers: false,
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

vi.mock("@/content/legal", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/legal")>();
  return {
    get privacyPolicy() {
      return overrides.legal ?? actual.privacyPolicy;
    },
    get termsOfUse() {
      return overrides.legal ?? actual.termsOfUse;
    },
  };
});

vi.mock("@/content/offers", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/content/offers")>();
  return {
    ...actual,
    get enabledOffers() {
      return overrides.hideOffers ? [] : actual.enabledOffers;
    },
  };
});

beforeEach(() => {
  overrides.services = undefined;
  overrides.legal = undefined;
  overrides.hideOffers = false;
});

it("composes header navigation and settings", async () => {
  const body = await render(Header);

  expect(
    body.querySelector("header[data-auto-hide-header]"),
  ).toBeInTheDocument();
  expect(body.querySelector("#mobile-menu-open")).toHaveAttribute(
    "aria-controls",
    "mobile-menu",
  );
  expect(body.querySelector("#mobile-menu")).toBeInTheDocument();
  expect(
    getByRole(body, "navigation", { name: /Основная/ }),
  ).toBeInTheDocument();
  expect(body.querySelector("[data-theme-settings]")).toBeInTheDocument();
});

it("composes homepage sections in editorial order", async () => {
  const body = await render(Homepage);
  const sections = [...body.querySelectorAll("section[id]")].map(
    (section) => section.id,
  );

  expect(sections).toEqual([
    "offers",
    "introduction",
    "about",
    "services",
    "projects",
    "ordering-process",
    "production-and-guarantees",
    "reviews",
    "business-solutions",
    "contacts",
    "order-inquiry",
  ]);
  expect(body.querySelector("#pricing")).toBeNull();
  expect(body.querySelector("#faq")).toBeNull();
  expect(body.querySelector("h1")).toBeInTheDocument();
  expect(body.querySelector("[data-inquiry]")).toBeInTheDocument();
});

it("composes cookie choices and legal links", async () => {
  const body = await render(CookieBanner);

  expect(body.querySelector("#cookie-banner")).toBeInTheDocument();
  expect(body.querySelectorAll("[data-cookie-choice]")).toHaveLength(2);
  expect(body.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
  expect(body.querySelector('a[href="/terms-of-use"]')).toBeInTheDocument();
});

it("renders layout defaults without a production URL", async () => {
  const document = await renderDocument(Layout, {
    slots: { default: "<h1>Slot heading</h1><p>Slot copy</p>" },
    url: "https://request.test/preview/?tracking=1",
  });
  expectPage(document);
  expectMetadata(document, site.title, site.description);
  expect(document.querySelector("main")).toHaveTextContent("Slot copy");
  expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  expect(document.head.querySelector('meta[name="viewport"]')).toHaveAttribute(
    "content",
    "width=device-width, initial-scale=1.0",
  );
  expect(
    document.head.querySelector('meta[name="color-scheme"]'),
  ).toHaveAttribute("content", "light dark");
});

it("renders noindex layout overrides and canonical path", async () => {
  const document = await renderDocument(Layout, {
    props: {
      title: "Fixture title",
      description: "Fixture summary",
      noindex: true,
    },
    slots: { default: "<h1>Visible heading</h1>" },
    site: "https://production.test/",
    url: "https://request.test/fixture/?tracking=1#topic",
  });
  expectPage(document);
  expectMetadata(
    document,
    `Fixture title | ${site.logoText}`,
    "Fixture summary",
    true,
  );
  expectCanonical(document, "/fixture/");
});

it("renders legal layout dates, lists and ordered sections", async () => {
  const document = await renderDocument(LegalLayout, {
    props: { document: routeFixture.legal, title: "Legal metadata override" },
  });
  expectPage(document);
  expectMetadata(
    document,
    `Legal metadata override | ${site.logoText}`,
    routeFixture.legal.description,
  );
  expect(document.querySelector("h1")).toHaveTextContent(
    "Fixture legal document",
  );
  expect(document.querySelector(".legal-date")).toHaveTextContent("2026-10-18");
  expect(
    [...document.querySelectorAll("main h2")].map((node) => node.textContent),
  ).toEqual(["First legal topic", "Second legal topic"]);
  expect(
    [...document.querySelectorAll("main li")].map((node) => node.textContent),
  ).toEqual(["First condition", "Second condition"]);
  expect(document.querySelector("[data-legal-back]")).toBeNull();
});

it("renders a minimal legal layout and native return link", async () => {
  const document = await renderDocument(LegalLayout, {
    props: {
      document: { ...routeFixture.legal, effectiveDate: "", sections: [] },
      showMobileBackLink: true,
    },
  });
  expectPage(document);
  expect(document.querySelector(".legal-date")).toBeNull();
  expect(document.querySelectorAll("main section")).toHaveLength(0);
  expect(document.querySelector("[data-legal-back]")).toHaveAttribute(
    "href",
    "/",
  );
});

const legalRoutes = [
  {
    component: Privacy,
    path: "/privacy-policy",
    back: true,
    getContent: () => privacyPolicy,
  },
  {
    component: Terms,
    path: "/terms-of-use",
    back: false,
    getContent: () => termsOfUse,
  },
];

it.each(legalRoutes)(
  "renders legal route $path metadata and content",
  async ({ component, path, back, getContent }) => {
    const content = getContent();
    const document = await renderDocument(component, {
      url: `https://request.test${path}`,
      site: "https://production.test/",
    });
    expectPage(document);
    expectMetadata(
      document,
      `${content.title} | ${site.logoText}`,
      content.description,
    );
    expectCanonical(document, path);
    expect(document.querySelector("h1")).toHaveTextContent(content.title);
    expect(document.querySelectorAll("main h2")).toHaveLength(
      content.sections.length,
    );
    expect(Boolean(document.querySelector("[data-legal-back]"))).toBe(back);
  },
);

it.each(legalRoutes)(
  "renders minimal legal route $path",
  async ({ component }) => {
    overrides.legal = {
      ...routeFixture.legal,
      effectiveDate: "",
      sections: [],
    };
    const document = await renderDocument(component);
    expectPage(document);
    expectMetadata(
      document,
      `Fixture legal document | ${site.logoText}`,
      "Fixture legal description",
    );
    expect(document.querySelector(".legal-date")).toBeNull();
    expect(document.querySelectorAll("main h2")).toHaveLength(0);
  },
);

it.each([false, true])(
  "renders homepage with offers withheld: %s",
  async (hideOffers) => {
    overrides.hideOffers = hideOffers;
    const document = await renderDocument(Homepage, {
      url: "https://request.test/",
      site: "https://production.test/",
    });
    expectPage(document);
    expectMetadata(document, site.logoText, site.description);
    expectCanonical(document, "/");
    const sections = [...document.querySelectorAll("main section[id]")].map(
      (section) => section.id,
    );
    expect(sections).toEqual([
      ...(hideOffers ? [] : ["offers"]),
      "introduction",
      "about",
      "services",
      "projects",
      "ordering-process",
      "production-and-guarantees",
      "reviews",
      "business-solutions",
      "contacts",
      "order-inquiry",
    ]);
    expect(
      document.querySelectorAll('[data-reveal-state="pending"]'),
    ).toHaveLength(0);
    expect(document.querySelector("main noscript")).toHaveTextContent(
      "JavaScript",
    );
    expect(document.querySelector("#order-inquiry fieldset")).toBeDisabled();
  },
);

it.each([false, true])(
  "renders 404 with services withheld: %s",
  async (withholdServices) => {
    if (withholdServices) {
      overrides.services = { ...services, items: [] };
    }
    const document = await renderDocument(NotFound, {
      url: "https://request.test/missing/?tracking=1",
      site: "https://production.test/",
    });
    expectPage(document);
    expectMetadata(
      document,
      `Страница не найдена | ${site.logoText}`,
      /Запрошенная страница не найдена\.[\s\S]*выберите другой раздел сайта\./,
      true,
    );
    expectCanonical(document, "/missing/");
    expect(document.querySelector("main h1")).toHaveTextContent(
      "Страница не найдена",
    );
    expect(document.querySelector('main a[href="/"]')).toHaveTextContent(
      "На главную",
    );
    const links = [...document.querySelectorAll(".not-found-links a")].map(
      (link) => link.getAttribute("href"),
    );
    expect(links).toEqual([
      ...(withholdServices ? [] : ["/#services"]),
      "/projects/",
      "/#contacts",
    ]);
  },
);

it("keeps every Astro page in the route coverage inventory", () => {
  const pages = import.meta.glob("../../src/pages/**/*.astro");
  const expected = [
    "index",
    "404",
    "privacy-policy",
    "terms-of-use",
    "projects/index",
    "projects/[id]",
    "projects/page/[page]",
    "services/[id]",
  ].map((path) => `../../src/pages/${path}.astro`);
  expect(Object.keys(pages).sort()).toEqual(expected.sort());
});
