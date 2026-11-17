// Check footer links and copy against the controlled site fixture.
// @vitest-environment node
import { expect, it, vi } from "vitest";
import { site } from "@/content/site";
import { visibleServices } from "@/content/services";
import { render } from "../../tests/helpers/render";
import Component from "./Footer.astro";

it("renders the configured footer content", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2042-06-15T12:00:00Z"));
  const body = await render(Component);
  vi.useRealTimers();

  const footer = body.querySelector("footer");
  const links = [...footer!.querySelectorAll<HTMLAnchorElement>("a")];

  expect(footer).not.toBeNull();
  expect(footer?.querySelector(".footer-brand")?.getAttribute("href")).toBe(
    "/",
  );
  expect(footer?.querySelector(".footer-brand")?.textContent).toContain(
    site.logoText,
  );
  expect(
    links.map((link) => [link.textContent?.trim(), link.getAttribute("href")]),
  ).toContainEqual([site.legal[0]?.label, site.legal[0]?.href]);
  expect(
    links.map((link) => [link.textContent?.trim(), link.getAttribute("href")]),
  ).toContainEqual([site.legal[1]?.label, site.legal[1]?.href]);
  expect(links.map((link) => link.getAttribute("href"))).toContain(
    `tel:${site.phone.replace(/\s/g, "")}`,
  );
  expect(links.map((link) => link.getAttribute("href"))).toContain(
    `mailto:${site.email}`,
  );
  expect(footer?.textContent).toContain(site.address);
  expect(footer?.textContent).toContain(site.workHours);
  expect(footer?.textContent).toContain(site.workHoursWeekend);
  const socialLinks = [...footer!.querySelectorAll(".footer-socials a")];
  expect(
    socialLinks.map((link) => [
      link.getAttribute("aria-label"),
      link.getAttribute("href"),
      link.querySelector("img")?.getAttribute("src"),
    ]),
  ).toEqual([
    ["ВКонтакте", "https://vk.com/", "/icons/social/vk.svg"],
    ["MAX", "https://max.ru/", "/icons/social/max.svg"],
    ["Telegram", "https://t.me/", "/icons/social/telegram.svg"],
  ]);
  expect(footer?.querySelector('a[href="/#services"]')).toHaveTextContent(
    "Все услуги",
  );
  expect(
    [...footer!.querySelectorAll('nav[aria-label="Услуги"] a')].map((link) =>
      link.getAttribute("href"),
    ),
  ).toEqual([...visibleServices.map((service) => service.href), "/#services"]);
  expect(
    [...footer!.querySelectorAll('nav[aria-label="Агентство"] a')].map((link) =>
      link.getAttribute("href"),
    ),
  ).toEqual(
    site.menu
      .filter((item) => item.href !== "/#services")
      .map((item) => item.href),
  );
  expect(
    footer?.querySelectorAll('nav[aria-label="Правовая информация"] a'),
  ).toHaveLength(site.legal.length + 1);
  expect(
    footer?.querySelector("[data-cookie-settings-trigger]"),
  ).toHaveTextContent("Настройки cookie");
  expect(footer?.querySelector('a[href="/sitemap.xml"]')).toHaveTextContent(
    "Карта сайта",
  );
  const disclosures = [
    ...(footer?.querySelectorAll("details[data-footer-group]") ?? []),
  ];
  expect(disclosures.map((item) => item.open)).toEqual([false, false]);
  expect(
    disclosures.map((item) => item.querySelector("summary")?.textContent),
  ).toEqual(["Услуги", "Агентство"]);
  expect(footer?.querySelectorAll(".footer-separator")).toHaveLength(3);
  expect(footer?.textContent).toContain(
    `© 2042 ${site.logoText}. ${site.footer.copyright}.`,
  );
});
