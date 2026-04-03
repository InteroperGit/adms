import { BaseArticleSchema, type BaseArticle } from './article';

/**
 * @module articles/serviceArticle
 * @description Service article schema — alias to BaseArticleSchema.
 * No type-specific fields beyond the base.
 */

export const ServiceArticleSchema = BaseArticleSchema;
export type ServiceArticle = BaseArticle;
