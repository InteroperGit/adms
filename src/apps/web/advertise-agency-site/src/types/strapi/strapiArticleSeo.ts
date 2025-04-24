import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";

/**
 * Интерфейс SEO статьи Strapi
 */
export interface StrapiArticleSeo extends Entity {
    metaTitle?: string;
    metaDescription?: string;
    shareImage?: ImageMeta;
}