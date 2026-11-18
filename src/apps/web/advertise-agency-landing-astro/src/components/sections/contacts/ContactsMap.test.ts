// @vitest-environment node
import { expect, it } from "vitest";
import fixture from "@/../tests/fixtures/content/site/settings/site.json";
import { siteSchema } from "@/validation/site";
import Component from "./ContactsMap.astro";
import { render } from "../../../../tests/helpers/render";

const site = siteSchema.parse(fixture);

it("renders a lazy iframe with its accessible name when enabled", async () => {
  const body = await render(Component, {
    enabled: true,
    src: site.mapSrc,
    title: `Карта расположения ${site.logoText}: ${site.address}`,
    fallback: site.mapFallback,
  });
  const frame = body.querySelector("iframe");

  expect(frame).toHaveAttribute("src", site.mapSrc);
  expect(frame).toHaveAttribute(
    "title",
    `Карта расположения ${site.logoText}: ${site.address}`,
  );
  expect(frame).toHaveAttribute("loading", "lazy");
});

it("renders the sized image fallback when the map is disabled", async () => {
  const body = await render(Component, {
    enabled: false,
    src: site.mapSrc,
    title: "Map",
    fallback: site.mapFallback,
  });
  const image = body.querySelector(".contact-map img");

  expect(image).toHaveAttribute("src", site.mapFallback.src);
  expect(image).toHaveAttribute("alt", site.mapFallback.alt);
  expect(image).toHaveAttribute("width", String(site.mapFallback.width));
  expect(image).toHaveAttribute("height", String(site.mapFallback.height));
  expect(body.querySelector("iframe")).toBeNull();
});
