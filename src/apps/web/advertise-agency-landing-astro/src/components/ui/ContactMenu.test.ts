// Verify contact choices, disabled delivery and callback panel navigation.
// @vitest-environment node
import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { fireEvent, getByRole } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { transpile } from "typescript";
import Component from "./ContactMenu.astro";
import { render } from "../../../tests/helpers/render";

const source = readFileSync(
  new URL("./ContactMenu.astro", import.meta.url),
  "utf8",
);
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const windows: JSDOM[] = [];

afterEach(() => {
  windows.splice(0).forEach((dom) => dom.window.close());
});

async function setup() {
  const body = await render(Component);
  const dom = new JSDOM(body.innerHTML, {
    url: "https://site.example/",
    runScripts: "outside-only",
  });
  windows.push(dom);
  const dialog =
    dom.window.document.querySelector<HTMLDialogElement>("#contact-menu")!;
  const openers = dom.window.document.querySelectorAll<HTMLElement>(
    "[data-contact-menu-opener]",
  );
  dialog.show = vi.fn(() => {
    dialog.open = true;
  });
  dialog.showModal = vi.fn(() => {
    dialog.open = true;
  });
  dialog.close = vi.fn(() => {
    dialog.open = false;
    dialog.dispatchEvent(new dom.window.Event("close"));
  });
  dom.window.matchMedia = vi.fn(() => ({ matches: false }) as MediaQueryList);
  if (!script) throw new Error("Contact menu script was not found");
  dom.window.eval(transpile(script));
  return { dom, dialog, openers };
}

it("renders four contact choices with local social assets", async () => {
  const body = await render(Component);
  const dialog = getByRole(body, "dialog", { hidden: true });

  expect(
    dialog.querySelectorAll("[data-contact-options] a, [data-callback-start]"),
  ).toHaveLength(4);
  expect(
    body.querySelector(".contact-menu-opener .lucide-message-circle"),
  ).not.toBeNull();
  expect(dialog.querySelectorAll("[data-contact-options] a")).toHaveLength(3);
  expect(dialog.querySelector('a[href="https://vk.com/"] img')).toHaveAttribute(
    "src",
    "/icons/social/vk.svg",
  );
  expect(dialog.querySelector('a[href="https://max.ru/"] img')).toHaveAttribute(
    "src",
    "/icons/social/max.svg",
  );
  expect(dialog.querySelector('a[href="https://t.me/"] img')).toHaveAttribute(
    "src",
    "/icons/social/telegram.svg",
  );
});

it("keeps callback sending disabled", async () => {
  const { dialog, openers } = await setup();
  const opener = openers[0]!;
  const callback = dialog.querySelector<HTMLElement>("[data-callback-form]")!;

  fireEvent.click(opener);
  expect(dialog.show).toHaveBeenCalledOnce();
  expect(opener).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(dialog.querySelector("[data-callback-start]")!);

  expect(callback).not.toHaveAttribute("hidden");
  expect(callback.querySelector("fieldset")).toBeDisabled();
  expect(callback.querySelector('[type="submit"]')).toBeDisabled();
  expect(callback.querySelector('a[href^="tel:"]')).toBeInTheDocument();
});

it("closes when its active opener is clicked again", async () => {
  const { dialog, openers } = await setup();
  const opener = openers[0]!;

  fireEvent.click(opener);
  expect(dialog.open).toBe(true);
  expect(opener).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(opener);

  expect(dialog.close).toHaveBeenCalledOnce();
  expect(dialog.open).toBe(false);
  expect(opener).toHaveAttribute("aria-expanded", "false");
});

it("returns to choices and restores opener focus", async () => {
  const { dom, dialog, openers } = await setup();
  const opener = openers[0]!;
  const options = dialog.querySelector<HTMLElement>("[data-contact-options]")!;

  opener.focus();
  fireEvent.click(opener);
  fireEvent.click(dialog.querySelector("[data-callback-start]")!);
  fireEvent.click(dialog.querySelector("[data-callback-back]")!);
  expect(options).not.toHaveAttribute("hidden");

  fireEvent.click(dialog.querySelector("[data-contact-menu-close]")!);
  expect(dialog.close).toHaveBeenCalledOnce();
  expect(opener).toHaveAttribute("aria-expanded", "false");
  expect(dom.window.document.activeElement).toBe(opener);
});
