import {ImageMeta} from "@/types/image";

/**
 * Тип блока статьи Strapi
 */
export type StrapiArticleBlock =
    | StrapiTextBlock
    | StrapiImageBlock
    | StrapiSliderBlock
    | StrapiQuoteBlock
    | StrapiVideoBlock
    | StrapiEmbedBlock

/**
 * Интерфейс базового блока
 */
export interface StrapiBaseBlock {
    __component: string,
    id: number
}

/**
 * Текстовый блок Strapi
 */
export interface StrapiTextBlock extends StrapiBaseBlock {
    body: string
}

/**
 * Блок изображения Strapi
 */
export interface StrapiImageBlock extends StrapiBaseBlock {
    file: ImageMeta
}

/**
 * Блок слайдера изображений
 */
export interface StrapiSliderBlock extends StrapiBaseBlock {
    files: ImageMeta[]
}

/**
 * Блок цитирования
 */
export interface StrapiQuoteBlock extends StrapiBaseBlock {
    title: string;
    body: string;
}

/**
 * Блок видео с внешнего источника
 */
export interface StrapiVideoBlock extends StrapiBaseBlock {
    url: string;
    caption?: string;
}

/**
 * Блок разделителя
 */
export interface StrapiDividerBlock extends StrapiBaseBlock {
    show?: boolean;
}

/**
 * Блок Встроенный контент (iframe)
 */
export interface StrapiEmbedBlock extends StrapiBaseBlock {
    html?: string;  // if you want to support raw HTML
    url?: string;   // if you want to support URL-based embeds
    provider?: string
    width?: number
    height?: number
}

/**
 * Тип формы
 */
export interface StrapiFormType extends StrapiBaseBlock {
    name?: string;
    title?: string;
}

/**
 * Блок формы
 */
export interface StrapiFormBlock extends StrapiBaseBlock {
    title?: string;
    formType?: StrapiFormType;
}