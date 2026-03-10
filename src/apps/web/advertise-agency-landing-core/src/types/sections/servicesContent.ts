import raw from '@data/sections/servicesContent.json';

export interface ServicesSectionContent {
  label: string;
  title: string;
  description: string;
}

export const servicesSectionContent = raw satisfies ServicesSectionContent;
