// Check the persistent action rail markup and its browser interaction.
// @vitest-environment node
import { expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { transpile } from "typescript";
import { site } from "@/content/site";
import { render } from "../../../tests/helpers/render";
import ActionRail from "./ActionRail.astro";

const source = readFileSync(
  new URL("./ActionRail.astro", import.meta.url),
  "utf8",
);
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];

it("renders labeled chat, phone, collapse, and return actions", async () => {
  const body = await render(ActionRail);
  const rail = body.querySelector<HTMLElement>("#quick-actions");

  expect(rail).not.toBeNull();
  expect(body.querySelector("nav[data-action-rail-host]")).toHaveAttribute(
    "hidden",
  );
  expect(body.querySelector("[data-action-rail-host]")).toHaveStyle(
    "--action-rail-reminder-interval: 30s",
  );
  body.querySelector("[data-action-rail-host]")?.removeAttribute("hidden");
  const chat = getByRole(body, "button", { name: "Чат" });
  expect(chat).toHaveClass("action-rail-button-chat");
  expect(chat).not.toHaveAttribute("onclick");
  expect(chat).not.toHaveAttribute("href");
  expect(chat).toHaveAttribute("data-tooltip", "Чат");
  const call = getByRole(body, "link", { name: "Позвонить нам" });
  expect(call).toHaveClass("action-rail-button-call");
  expect(call).toHaveAttribute("href", `tel:${site.phone.replace(/\s/g, "")}`);
  const collapse = getByRole(body, "button", {
    name: "Свернуть панель действий",
  });
  expect(collapse).toHaveClass("action-rail-button-collapse");
  expect(collapse).toHaveAttribute("data-tooltip", "Свернуть меню");
  expect(getByRole(body, "button", { name: "Вернуться наверх" })).toHaveClass(
    "action-rail-button-top",
  );
  expect(body.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(5);
});

it("preserves focus across scroll and collapse states", async () => {
  if (!script) throw new Error("Action rail script was not found");
  const body = await render(ActionRail);
  const dom = new JSDOM(body.innerHTML, {
    url: "https://site.example/",
    runScripts: "outside-only",
  });
  const { document } = dom.window;
  const host = document.querySelector<HTMLElement>("[data-action-rail-host]")!;
  const rail = document.querySelector<HTMLElement>("[data-action-rail]")!;
  const collapse = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-collapse]",
  )!;
  const restore = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-restore]",
  )!;
  const scrollTop = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-top]",
  )!;
  const brand = document.createElement("a");
  brand.className = "header-brand";
  brand.href = "/";
  document.body.append(brand);
  Object.defineProperty(dom.window, "scrollY", {
    configurable: true,
    writable: true,
    value: 0,
  });
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({ matches: true }),
  });
  dom.window.scrollTo = vi.fn();
  dom.window.eval(transpile(script, { target: 9 }));

  expect(host.hidden).toBe(true);
  Object.defineProperty(dom.window, "scrollY", { value: 200 });
  dom.window.dispatchEvent(new dom.window.Event("scroll"));
  expect(host.hidden).toBe(false);
  collapse.click();
  expect(host.dataset.collapsed).toBe("true");
  expect(rail.inert).toBe(true);
  expect(document.activeElement).toBe(restore);
  expect(restore).toHaveAttribute("aria-expanded", "true");

  Object.defineProperty(dom.window, "scrollY", { value: 0 });
  dom.window.dispatchEvent(new dom.window.Event("scroll"));
  expect(host.hidden).toBe(true);
  expect(host.dataset.collapsed).toBe("true");
  expect(document.activeElement).toBe(brand);

  Object.defineProperty(dom.window, "scrollY", { value: 200 });
  dom.window.dispatchEvent(new dom.window.Event("scroll"));
  expect(host.hidden).toBe(false);
  expect(host.dataset.collapsed).toBe("true");

  restore.click();
  expect(rail.inert).toBe(false);
  expect(document.activeElement).toBe(collapse);
  expect(collapse).toHaveAttribute("aria-expanded", "true");

  scrollTop.focus();
  scrollTop.click();
  expect(dom.window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    behavior: "instant",
  });
  Object.defineProperty(dom.window, "scrollY", { value: 0 });
  dom.window.dispatchEvent(new dom.window.Event("scroll"));
  expect(host.hidden).toBe(true);
  expect(document.activeElement).toBe(brand);
  dom.window.close();
});
