import {ImageMeta} from "@/types/image";

/**
 * SEO-метаданные статьи
 */
export interface Seo {
    title?: string;
    description?: string;
    ogImage?: ImageMeta;
}