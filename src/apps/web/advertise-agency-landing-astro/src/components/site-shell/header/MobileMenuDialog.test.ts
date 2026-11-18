// Verify the nonmodal mobile drawer, trigger toggle and native link behavior.
// @vitest-environment node
import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { fireEvent, getByRole } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { transpile } from "typescript";
import MobileMenuDialog from "./MobileMenuDialog.astro";
import { render } from "../../../../tests/helpers/render";

const source = readFileSync(
  new URL("./MobileMenuDialog.astro", import.meta.url),
  "utf8",
);
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const windows: JSDOM[] = [];
const props = {
  items: [
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/projects/" },
  ],
};

afterEach(() => {
  windows.splice(0).forEach((dom) => dom.window.close());
});

async function setup(openerPresent = true, menuPresent = true) {
  const body = await render(MobileMenuDialog, props);
  const openerMarkup = openerPresent
    ? '<header data-auto-hide-header><div class="header-layout">' +
      '<button id="mobile-menu-open" aria-expanded="false">Menu</button>' +
      "</div></header>"
    : "";
  const dom = new JSDOM(
    openerMarkup +
      (menuPresent ? body.innerHTML : "") +
      '<section id="services">Services section</section>' +
      '<button id="outside">Outside</button>',
    { url: "https://example.test/", runScripts: "outside-only" },
  );
  windows.push(dom);
  const { document } = dom.window;
  const menu = document.querySelector<HTMLDialogElement>("dialog");
  const opener = document.querySelector<HTMLButtonElement>("#mobile-menu-open");

  if (menu) {
    menu.show = vi.fn(() => {
      menu.open = true;
      menu.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    });
    menu.close = vi.fn(() => {
      menu.open = false;
      menu.dispatchEvent(new dom.window.Event("close"));
    });
  }
  if (!script) throw new Error("Mobile menu script was not found");
  dom.window.eval(transpile(script));
  return { dom, document, menu, opener };
}

it("renders only supplied links with icons and themed separators", async () => {
  const body = await render(MobileMenuDialog, props);
  const menu = getByRole(body, "dialog", { hidden: true });
  const nav = menu.querySelector("nav");

  expect(menu).toHaveAttribute("id", "mobile-menu");
  expect(menu).not.toHaveAttribute("open");
  expect(menu.querySelectorAll("a")).toHaveLength(props.items.length);
  expect(menu.querySelectorAll(".mobile-link-icon")).toHaveLength(
    props.items.length,
  );
  expect(menu.querySelectorAll(".mobile-link-divider")).toHaveLength(
    props.items.length - 1,
  );
  expect(nav?.querySelector("[href='/projects/']")).toBeInTheDocument();
  expect(menu.querySelector("[data-menu-close]")).toBeNull();
  expect(menu.querySelector(".mobile-menu-actions")).toBeNull();
  expect(menu.querySelector(".mobile-menu-divider")).toBeNull();
});

it("opens and closes from the same trigger with animated state", async () => {
  const { document, menu, opener } = await setup();
  expect(menu).not.toBeNull();
  expect(opener).not.toBeNull();

  fireEvent.click(opener!);
  expect(menu!.show).toHaveBeenCalledOnce();
  expect(menu!.open).toBe(true);
  expect(opener).toHaveAttribute("aria-expanded", "true");
  expect(opener).toHaveAttribute("aria-label", "Закрыть меню");
  expect(document.querySelector("header")).toHaveAttribute(
    "data-mobile-menu-open",
    "",
  );
  expect(document.activeElement).toBe(menu!.querySelector("a"));

  fireEvent.click(opener!);
  expect(menu!.close).toHaveBeenCalledOnce();
  expect(menu!.open).toBe(false);
  expect(opener).toHaveAttribute("aria-expanded", "false");
  expect(opener).toHaveAttribute("aria-label", "Открыть меню");
  expect(document.activeElement).toBe(opener);
});

it("closes on Escape and restores trigger focus", async () => {
  const { dom, document, menu, opener } = await setup();
  fireEvent.click(opener!);
  fireEvent.keyDown(menu!, { key: "Escape" });

  expect(menu!.close).toHaveBeenCalledOnce();
  expect(menu!.open).toBe(false);
  expect(document.activeElement).toBe(opener);
  dom.window.close();
});

it("removes pointer focus from the menu trigger after closing", async () => {
  const { document, menu, opener } = await setup();
  fireEvent.click(opener!, { detail: 1 });
  fireEvent.click(opener!, { detail: 1 });

  expect(menu!.open).toBe(false);
  expect(document.activeElement).not.toBe(opener);
});

it("dismisses outside clicks without stealing their focus", async () => {
  const { document, menu, opener } = await setup();
  const outside = document.querySelector<HTMLButtonElement>("#outside")!;
  fireEvent.click(opener!);
  outside.focus();
  fireEvent.pointerDown(outside);

  expect(menu!.close).toHaveBeenCalledOnce();
  expect(menu!.open).toBe(false);
  expect(document.activeElement).toBe(outside);
});

it("closes same-page links and focuses their section", async () => {
  const { dom, document, menu, opener } = await setup();
  const section = document.getElementById("services")!;
  section.scrollIntoView = vi.fn();
  fireEvent.click(opener!);
  const link = menu!.querySelector<HTMLAnchorElement>("a[href]")!;
  link.addEventListener("click", (event) => event.preventDefault());
  fireEvent.click(link);

  expect(menu!.open).toBe(false);
  expect(dom.window.location.hash).toBe("#services");
  expect(document.activeElement).toBe(section);
  expect(section).toHaveAttribute("tabindex", "-1");
  expect(section.scrollIntoView).toHaveBeenCalledOnce();
});

it("preserves modified navigation without closing", async () => {
  const { menu, opener } = await setup();
  fireEvent.click(opener!);
  const link = menu!.querySelector<HTMLAnchorElement>("a[href]")!;
  link.addEventListener("click", (event) => event.preventDefault());
  fireEvent.click(link, { ctrlKey: true });

  expect(menu!.open).toBe(true);
  expect(menu!.close).not.toHaveBeenCalled();
});

it("closes when the responsive layout hides its opener", async () => {
  const { dom, menu, opener } = await setup();
  const rects = vi.spyOn(opener!, "getClientRects");
  rects.mockReturnValue([{}] as unknown as DOMRectList);
  fireEvent.click(opener!);
  dom.window.dispatchEvent(new dom.window.Event("resize"));
  expect(menu!.open).toBe(true);

  rects.mockReturnValue([] as unknown as DOMRectList);
  dom.window.dispatchEvent(new dom.window.Event("resize"));
  expect(menu!.close).toHaveBeenCalledOnce();
  expect(menu!.open).toBe(false);
});

it.each([
  [false, true],
  [true, false],
  [false, false],
])("ignores missing elements (opener %s, menu %s)", async (opener, menu) => {
  const result = await setup(opener, menu);
  if (result.opener) fireEvent.click(result.opener);
  if (result.menu) expect(result.menu.show).not.toHaveBeenCalled();
});
