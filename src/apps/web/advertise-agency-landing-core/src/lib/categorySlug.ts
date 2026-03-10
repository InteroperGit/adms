import { categories } from '@/types/config/categories';

export function categorySlug(name: string): string {
  return categories.find((c) => c.name === name)?.slug ?? 'all';
}
