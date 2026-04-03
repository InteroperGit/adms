import { BaseArticleSchema, type BaseArticle } from './article';

/**
 * @module articles/blogArticle
 * @description Blog article schema — alias to BaseArticleSchema.
 * No type-specific fields beyond the base.
 */

export const BlogArticleSchema = BaseArticleSchema;
export type BlogArticle = BaseArticle;
