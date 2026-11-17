import data from "@/data/content/site/lists/services.json";
import { getCollection, render } from "astro:content";
import {
  createServiceRecordsSchema,
  createServicesSchema,
} from "../validation/services";
import { serviceArticleSchema } from "../validation/serviceArticles";
import { parseContent } from "../validation/parseContent";
import {
  getVisibleServices,
  isServicePublished,
} from "../validation/policies/servicePublication";
// prettier-ignore
import {
  assertPublicationPolicy,
} from "../validation/policies/blockPublication";

// The dynamic route is backed by catalog IDs, so route validation can happen
// without importing or scanning page modules and without a loader cycle.
const servicePaths = data.items.flatMap((item) =>
  typeof item.href === "string" ? [item.href] : [],
);
const records = parseContent(
  createServiceRecordsSchema(servicePaths),
  data,
  "data/content/site/lists/services.json",
);
const entries = await getCollection("serviceArticles");
const articleById = new Map(entries.map((entry) => [entry.id, entry]));

// Compile MDX once and share its validated normalized blocks with all readers.
// Invalid or missing MDX is an error, never an implicit JSON fallback.
const items = await Promise.all(
  records.items.map(async (record) => {
    if (record.article.format === "json") {
      const { format: _format, reason: _reason, ...article } = record.article;
      return { ...record, article };
    }
    if (record.article.entry !== record.id) {
      throw new Error(`Service article id mismatch: ${record.id}`);
    }
    const entry = articleById.get(record.article.entry);
    if (!entry) throw new Error(`Missing service article: ${record.id}`);
    const { remarkPluginFrontmatter } = await render(entry);
    const article = parseContent(
      serviceArticleSchema,
      {
        ...entry.data,
        content: remarkPluginFrontmatter.content,
      },
      entry.filePath ?? entry.id,
    );
    return { ...record, article };
  }),
);

export const services = parseContent(
  createServicesSchema(servicePaths),
  { ...records, items },
  "data/content/site/lists/services.json",
);
services.items.forEach((service) =>
  assertPublicationPolicy(
    service.article.content,
    !services.demoMode &&
      isServicePublished(services, service) &&
      service.article.approved
      ? "published"
      : "demo",
    `service ${service.id}`,
  ),
);

/** Public cards require confirmed claims, copy and genuine approved media. */
export const publishedServices = services.items.filter((item) =>
  isServicePublished(services, item),
);

export const visibleServices = getVisibleServices(services);
