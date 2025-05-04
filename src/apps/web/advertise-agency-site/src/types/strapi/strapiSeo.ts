import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";

/**
 * Интерфейс SEO статьи Strapi
 */
export interface StrapiSeo extends Entity {
    metaTitle?: string;
    metaDescription?: string;
    shareImage?: ImageMeta;
}