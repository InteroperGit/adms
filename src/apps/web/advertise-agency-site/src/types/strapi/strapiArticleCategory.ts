import {Entity} from "@/types/base";

/**
 * Интерфейс категории услуг Strapi
 */
export interface StrapiArticleCategory extends Entity {
    name: string;

    slug: string;

    title: string;

    description: string;
}