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
    order?: number;
    is_header?: boolean;
    cover?: ImageMeta;
    items?: ServiceCategory[];
}
