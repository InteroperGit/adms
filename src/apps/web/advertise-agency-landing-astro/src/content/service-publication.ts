import type { ServicesContent } from '../types/services';

/** Demonstration visibility does not change any agency approval flags. */
export function getVisibleServices(content: ServicesContent) {
  if (content.demoMode) return content.items;
  if (!content.copyApproved) return [];
  return content.items.filter((item) =>
    item.confirmed && item.copyApproved && item.image?.approved);
}
