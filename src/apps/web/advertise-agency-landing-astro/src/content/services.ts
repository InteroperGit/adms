import data from '@/data/content/services.json';
import { createServicesSchema } from '../validation/services';
import { parseContent } from '../validation/parse-content';
import { getVisibleServices } from './service-publication';

const pages = import.meta.glob('/src/pages/services/**/*.astro');
const publishedPaths = Object.keys(pages)
  .filter((path) => !path.includes('['))
  .map((path) => path
    .replace('/src/pages', '')
    .replace(/\/index\.astro$/, '/')
    .replace(/\.astro$/, '/'));

export const services = parseContent(
  createServicesSchema(publishedPaths),
  data,
  'data/content/services.json',
);

/** Public cards require confirmed claims, copy and genuine approved media. */
export const publishedServices = services.copyApproved
  ? services.items.filter((item) =>
    item.confirmed && item.copyApproved && item.image?.approved)
  : [];

export const visibleServices = getVisibleServices(services);
