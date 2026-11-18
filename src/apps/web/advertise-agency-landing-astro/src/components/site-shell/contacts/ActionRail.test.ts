// Check the persistent action rail markup and its browser interaction.
// @vitest-environment node
import { expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { transpile } from "typescript";
import { site } from "@/content/site";
import { render } from "../../../../tests/helpers/render";
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
  expect(body.querySelector("nav[data-action-rail-host]")).not.toHaveAttribute(
    "hidden",
  );
  expect(body.querySelector("[data-action-rail-host]")).toHaveStyle(
    "--action-rail-reminder-interval: 30s",
  );
  const chat = getByRole(body, "button", { name: "Чат" });
  expect(chat).toHaveClass("action-rail-button-chat");
  expect(chat).toHaveClass("action-rail-chat-fixed");
  expect(chat).toHaveAttribute("data-action-rail-chat");
  expect(chat.closest("nav")).toBeNull();
  expect(chat.querySelector(".lucide-message-circle")).toHaveAttribute(
    "stroke-width",
    "2.5",
  );
  expect(chat.querySelectorAll(".action-rail-chat-typing span")).toHaveLength(
    3,
  );
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
  expect(body.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(4);
});

it("keeps rail visible across collapse and focus", async () => {
  if (!script) throw new Error("Action rail script was not found");
  const body = await render(ActionRail);
  const dom = new JSDOM(body.innerHTML, {
    url: "https://site.example/",
    runScripts: "outside-only",
  });
  const { document } = dom.window;
  const host = document.querySelector<HTMLElement>("[data-action-rail-host]")!;
  const header = document.createElement("header");
  header.dataset.autoHideHeader = "";
  header.dataset.hidden = "false";
  document.body.append(header);
  const actionGroup =
    document.querySelector<HTMLElement>(".action-rail-group")!;
  const collapse = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-collapse]",
  )!;
  const restore = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-restore]",
  )!;
  const scrollTop = document.querySelector<HTMLButtonElement>(
    "[data-action-rail-top]",
  )!;
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

  expect(host.hidden).toBe(false);
  expect(host.style.getPropertyValue("--action-rail-header-offset")).toBe(
    "var(--site-header-clearance, 5rem)",
  );
  header.dataset.hidden = "true";
  header.dispatchEvent(new dom.window.Event("transitionend"));
  expect(host.style.getPropertyValue("--action-rail-header-offset")).toBe(
    "0px",
  );
  header.dataset.hidden = "false";
  header.dispatchEvent(new dom.window.Event("transitionend"));
  expect(host.style.getPropertyValue("--action-rail-header-offset")).toBe(
    "var(--site-header-clearance, 5rem)",
  );
  collapse.click();
  expect(host.dataset.collapsed).toBe("true");
  expect(actionGroup.inert).toBe(true);
  expect(scrollTop).not.toHaveAttribute("inert");
  expect(document.activeElement).toBe(restore);
  expect(restore).toHaveAttribute("aria-expanded", "true");

  dom.window.dispatchEvent(new dom.window.Event("scroll"));
  expect(host.hidden).toBe(false);
  expect(host.dataset.collapsed).toBe("true");

  restore.click();
  expect(actionGroup.inert).toBe(false);
  expect(document.activeElement).toBe(collapse);
  expect(collapse).toHaveAttribute("aria-expanded", "true");

  scrollTop.focus();
  scrollTop.click();
  expect(dom.window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    behavior: "instant",
  });
  expect(host.hidden).toBe(false);
  dom.window.close();
});
