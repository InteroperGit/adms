// src/content/site.ts
import siteData from "@/data/content/site/settings/site.json";
import type { SiteConfig } from "@/types/site";
import { parseContent } from "@/validation/parseContent";
import { siteSchema } from "@/validation/site";
import { visibleServices } from "./services";

const validatedSite = parseContent(
  siteSchema,
  siteData,
  "data/content/site/settings/site.json",
);

// Экспортируем типизированный объект конфигурации
export const site: SiteConfig = {
  ...validatedSite,
  menu: validatedSite.menu.filter(
    (item) => item.href !== "/#services" || visibleServices.length > 0,
  ),
};
