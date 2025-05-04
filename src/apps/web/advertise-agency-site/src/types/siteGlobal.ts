import {ImageMeta} from "@/types/image";
import {Seo} from "@/types/seo";

/**
 * Global
 * Содержит основные данные по сайту
 */
export interface SiteGlobal {
    siteName: string;

    favicon?: ImageMeta;

    siteDescription?: string;

    seo: Seo;
}