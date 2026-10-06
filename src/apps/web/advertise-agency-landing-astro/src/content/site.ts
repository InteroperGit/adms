// src/content/site.ts
import siteData from '@/data/content/site.json';
import type { SiteConfig } from '@/types/site';
import { visibleServices } from './services';

// Экспортируем типизированный объект конфигурации
export const site: SiteConfig = {
  ...siteData,
  menu: siteData.menu.filter((item) =>
    item.href !== '/#services' || visibleServices.length > 0),
};
