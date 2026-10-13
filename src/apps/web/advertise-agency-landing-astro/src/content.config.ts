// Collections validate metadata; the service loader validates compiled blocks.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { serviceArticleMetadataSchema } from './validation/service-articles';
import { projectArticleMetadataSchema } from './validation/projects';

const serviceArticles = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './data/content/articles/services',
  }),
  schema: serviceArticleMetadataSchema,
});

const projectArticles = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './data/content/articles/projects',
  }),
  schema: projectArticleMetadataSchema,
});

// Fixtures validate with the same compiler but have no production route.
const articleFixtures = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './data/content/fixtures/articles',
  }),
  schema: serviceArticleMetadataSchema,
});

export const collections = {
  serviceArticles, projectArticles, articleFixtures,
};
