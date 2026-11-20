// Verify project-only return state and storage failure fallback behavior.
// @vitest-environment node
import { JSDOM } from "jsdom";
import { fireEvent } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("project catalog return state", () => {
  let dom: JSDOM;

  beforeEach(() => {
    vi.resetModules();
    dom = new JSDOM(
      `<a href="/projects/12/" data-project-link>
        <span>Open project</span>
      </a>
      <a href="/contact/">Contact</a>`,
      {
        url: "https://catalog.example.test/projects/page/2/?keep=1",
      },
    );
    vi.stubGlobal("window", dom.window);
    vi.stubGlobal("document", dom.window.document);
    vi.stubGlobal("Element", dom.window.Element);
    vi.stubGlobal("sessionStorage", dom.window.sessionStorage);
  });

  afterEach(() => {
    dom.window.close();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("stores the filtered route when navigation is prevented", async () => {
    await import("./projectCatalogRuntime");
    const target = document.querySelector("[data-project-link] span")!;
    target.addEventListener("click", (event) => event.preventDefault());

    fireEvent.click(target);

    expect(sessionStorage.getItem("project-catalog-return")).toBe(
      "/projects/page/2/?keep=1#catalog-results",
    );
  });

  it("preserves filters and tolerates blocked session storage", async () => {
    window.history.replaceState(
      null,
      "",
      "/projects/?q=neon&category=signs#results",
    );
    vi.spyOn(dom.window.Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    await import("./projectCatalogRuntime");

    expect(() =>
      fireEvent.click(document.querySelector("[data-project-link] span")!),
    ).not.toThrow();
    expect(() =>
      fireEvent.click(document.querySelector('a[href="/contact/"]')!),
    ).not.toThrow();
  });
});
