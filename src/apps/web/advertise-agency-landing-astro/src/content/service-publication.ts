import type { Service, ServicesContent } from '../types/services';

/** Share the agency publication decision across cards and article metadata. */
export function isServicePublished(
  content: ServicesContent,
  service: Service,
) {
  return content.copyApproved && service.confirmed && service.copyApproved
    && Boolean(service.image?.approved);
}

/** A published category alone does not authorize indexing its draft article. */
export function isServiceArticlePublished(
  content: ServicesContent,
  service: Service,
) {
  return !content.demoMode && isServicePublished(content, service)
    && service.article.approved;
}

/** Advertise only existing, approved article routes to search engines. */
export function getPublishedServicePaths(content: ServicesContent) {
  return content.items.filter((service) =>
    service.href && isServiceArticlePublished(content, service))
    .map((service) => service.href!);
}

/** Demonstration visibility does not change any agency approval flags. */
export function getVisibleServices(content: ServicesContent) {
  if (content.demoMode) return content.items;
  return content.items.filter((item) => isServicePublished(content, item));
}
