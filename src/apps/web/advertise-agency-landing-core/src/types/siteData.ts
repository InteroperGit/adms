import data from '@data/site.json';

export interface SiteData {
  name: string;
  description: string;
  yandexMapsOrgId?: string;
  yandexMapUrl?: string;
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
