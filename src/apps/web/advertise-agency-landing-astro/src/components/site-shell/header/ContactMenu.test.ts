// Verify contact choices and the separate disabled callback modal.
// @vitest-environment node
import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { transpile } from "typescript";
import { site } from "@/content/site";
import Component from "./ContactMenu.astro";
import { render } from "../../../../tests/helpers/render";

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
  const body = await render(Component, { phone: site.phone });
  const dom = new JSDOM(body.innerHTML, {
    url: "https://site.example/",
    runScripts: "outside-only",
  });
  windows.push(dom);
  const dialog =
    dom.window.document.querySelector<HTMLDialogElement>("#contact-menu")!;
  const callbackDialog =
    dom.window.document.querySelector<HTMLDialogElement>("#callback-dialog")!;
  const openers = [
    dom.window.document.querySelector<HTMLElement>(
      ".contact-menu-opener-mobile",
    )!,
    dom.window.document.querySelector<HTMLElement>(
      ".contact-menu-opener-desktop",
    )!,
  ];
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
  callbackDialog.showModal = vi.fn(() => {
    callbackDialog.open = true;
  });
  callbackDialog.close = vi.fn(() => {
    callbackDialog.open = false;
    callbackDialog.dispatchEvent(new dom.window.Event("close"));
  });
  dom.window.matchMedia = vi.fn(() => ({ matches: false }) as MediaQueryList);
  if (!script) throw new Error("Contact menu script was not found");
  dom.window.eval(transpile(script));
  return { dom, dialog, callbackDialog, openers };
}

it("renders five contact choices with local social assets", async () => {
  const body = await render(Component, { phone: site.phone });
  const dialog = body.querySelector<HTMLDialogElement>("#contact-menu")!;

  expect(
    dialog.querySelectorAll("[data-contact-options] a, [data-callback-start]"),
  ).toHaveLength(5);
  const mobileOpener = body.querySelector(".contact-menu-opener-mobile");
  const desktopOpener = body.querySelector(".contact-menu-opener-desktop");
  expect(mobileOpener?.querySelector(".lucide-phone")).not.toBeNull();
  expect(mobileOpener?.querySelector(".lucide-message-circle")).not.toBeNull();
  expect(mobileOpener).toHaveAccessibleName("Связаться");
  expect(desktopOpener?.querySelector(".lucide-message-circle")).not.toBeNull();
  expect(desktopOpener?.querySelector(".lucide-phone")).toBeNull();
  expect(dialog.querySelectorAll("[data-contact-options] a")).toHaveLength(4);
  expect(dialog.querySelector("[data-contact-options] a")).toHaveTextContent(
    "Позвонить",
  );
  expect(dialog.querySelector("[data-contact-options] a")).toHaveAttribute(
    "href",
    `tel:${site.phone.replace(/\s/g, "")}`,
  );
  const callbackDialog =
    body.querySelector<HTMLDialogElement>("#callback-dialog")!;
  expect(callbackDialog).toHaveAttribute("aria-labelledby", "callback-title");
  expect(callbackDialog.querySelector("#callback-title")).toBeInTheDocument();
  expect(
    callbackDialog.querySelector('.callback-consent a[href="/privacy-policy"]'),
  ).toHaveTextContent("политикой конфиденциальности");
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

it("opens a separate disabled callback modal", async () => {
  const { dom, dialog, callbackDialog, openers } = await setup();
  const opener = openers[0]!;
  Object.defineProperty(dom.window, "innerWidth", { value: 1024 });
  Object.defineProperty(opener, "getBoundingClientRect", {
    value: () => ({ bottom: 120, right: 200 }),
  });
  const callback = callbackDialog.querySelector<HTMLElement>(
    "[data-callback-form]",
  )!;

  fireEvent.click(opener);
  expect(dialog.show).toHaveBeenCalledOnce();
  expect(dialog.style.top).toBe("128px");
  expect(dialog.style.right).toBe("824px");
  expect(opener).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(dialog.querySelector("[data-callback-start]")!);

  expect(dialog.open).toBe(false);
  expect(opener).toHaveAttribute("aria-expanded", "false");
  expect(callbackDialog.showModal).toHaveBeenCalledOnce();
  expect(callbackDialog.open).toBe(true);
  expect(callbackDialog).toHaveAttribute("aria-labelledby", "callback-title");
  expect(callbackDialog.contains(callback)).toBe(true);
  expect(callback.querySelector("fieldset")).not.toBeDisabled();
  const name = callback.querySelector<HTMLInputElement>("#callback-name")!;
  fireEvent.input(name, { target: { value: "Visitor" } });
  expect(name).toHaveValue("Visitor");
  expect(callback.querySelector('[name="phone"]')).toHaveAttribute(
    "type",
    "tel",
  );
  expect(fireEvent.submit(callback.querySelector("form")!)).toBe(false);
  expect(callback.querySelector('[type="submit"]')).toBeDisabled();
  expect(callback.querySelector('a[href^="tel:"]')).toBeNull();
  expect(callback.querySelector("[data-callback-close]")).toBeVisible();
});

it("restores focus when callback closes and reopens contacts", async () => {
  const { dialog, callbackDialog, openers } = await setup();
  const opener = openers[0]!;
  opener.focus();

  fireEvent.click(opener);
  fireEvent.click(dialog.querySelector("[data-callback-start]")!);
  callbackDialog.close();

  expect(callbackDialog.open).toBe(false);
  expect(dialog.open).toBe(false);
  expect(opener).toHaveAttribute("aria-expanded", "false");
  expect(opener.ownerDocument.activeElement).toBe(opener);

  fireEvent.click(opener);
  expect(dialog.open).toBe(true);
  expect(callbackDialog.open).toBe(false);
  expect(dialog.querySelector("[data-contact-options]")).not.toHaveAttribute(
    "hidden",
  );
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

it("restores opener focus when contacts close", async () => {
  const { dom, dialog, openers } = await setup();
  const opener = openers[0]!;

  opener.focus();
  fireEvent.click(opener);
  fireEvent.click(dialog.querySelector("[data-contact-menu-close]")!);
  expect(dialog.close).toHaveBeenCalledOnce();
  expect(opener).toHaveAttribute("aria-expanded", "false");
  expect(dom.window.document.activeElement).toBe(opener);
});

it("closes the mobile sheet after a downward swipe on its handle", async () => {
  const { dom, dialog, openers } = await setup();
  dom.window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);
  const opener = openers[0]!;
  fireEvent.click(opener);
  const handle = dialog.querySelector<HTMLElement>(
    "[data-contact-menu-close]",
  )!;
  fireEvent.pointerDown(handle, { pointerType: "touch", clientY: 100 });
  fireEvent.pointerUp(handle, { pointerType: "touch", clientY: 160 });

  expect(dialog.close).toHaveBeenCalledOnce();
  expect(dialog.open).toBe(false);
  expect(opener.ownerDocument.activeElement).toBe(opener);
});

it("dismisses contacts from outside pointer actions", async () => {
  const { dom, dialog, callbackDialog, openers } = await setup();
  const outside = dom.window.document.createElement("button");
  dom.window.document.body.append(outside);

  fireEvent.click(openers[0]!);
  fireEvent.pointerDown(outside);

  expect(dialog.open).toBe(false);
  expect(callbackDialog.open).toBe(false);
  expect(openers[0]).toHaveAttribute("aria-expanded", "false");
});

it("closes nonmodal contacts with Escape", async () => {
  const { dialog, openers } = await setup();
  fireEvent.click(openers[0]!);
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(dialog.open).toBe(false);
  expect(openers[0]!.ownerDocument.activeElement).toBe(openers[0]);
});
