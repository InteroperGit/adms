import {ImageMeta} from "@/types/image";

/**
 * Категория услуг
 */
export interface ServiceCategory {
    id: number;
    name: string;
    title?: string;
    description?: string;
    href?: string;
    cover?: ImageMeta;
    items?: ServiceCategory[];
}

/**
 * Услуга
 */
export interface ServiceItem {
    name: string;
    title: string;
    description?: string;
    href?: string;
    previewImage?: ImageMeta;
    items?: ServiceItem[];
}