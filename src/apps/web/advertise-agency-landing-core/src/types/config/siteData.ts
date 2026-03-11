import data from '@data/config/site.json';
import type { ImageOptimizationConfig } from './imageOptimization';

export type { ImageOptimizationConfig };

export interface SiteData {
  name: string;
  description: string;
  yandexMapsOrgId?: string;
  yandexMapUrl?: string;
  imageOptimization?: ImageOptimizationConfig;
  contact: {
    phone: string;
    email: string;
    address: string;
    telegram: string;
    vk: string;
    workingHours: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
  };
}

export const siteData = data satisfies SiteData;
