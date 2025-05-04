import {ImageMeta} from "@/types/image";
import {StrapiSeo} from "@/types/strapi/strapiSeo";

/**
 * Тип Global от Strapi
 */
export interface StrapiGlobal {
    siteName: string;

    favicon: ImageMeta;

    siteDescription: string;

    defaultSeo: StrapiSeo;
}