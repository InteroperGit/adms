import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";

/**
 * Промоушен из Strapi
 */
export interface StrapiPromotion extends Entity {
    title: string;
    slug: string;
    description?: string;
    cover: ImageMeta;
    articleUrl: string;
}