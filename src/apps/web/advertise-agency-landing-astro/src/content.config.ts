// Collections validate metadata; the service loader validates compiled blocks.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { serviceArticleMetadataSchema } from './validation/service-articles';
import { projectArticleMetadataSchema } from './validation/projects';

// E2E builds load only synthetic articles, never deployment content.
const contentRoot = process.env.E2E_CONTENT_ROOT ?? './data/content';

const serviceArticles = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: `${contentRoot}/articles/services`,
  }),
  schema: serviceArticleMetadataSchema,
});

const projectArticles = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: `${contentRoot}/articles/projects`,
  }),
  schema: projectArticleMetadataSchema,
});

// Fixtures validate with the same compiler but have no production route.
const articleFixtures = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: `${contentRoot}/fixtures/articles`,
  }),
  schema: serviceArticleMetadataSchema,
});

export const collections = {
  serviceArticles,
  projectArticles,
  articleFixtures,
};
