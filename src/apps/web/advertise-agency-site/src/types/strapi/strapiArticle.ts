import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";
import {ArticleCategory} from "@/types/article";
import {Author} from "@/types/author";

/**
 * Основной интерфейс статьи Strapi
 */
export interface StrapiArticle extends Entity {
    /**
     * Заголовок статьи (h1)
     */
    title: string

    /**
     * Краткое описание
     */
    description: string

    /**
     * Время чтения в минутах
     */
    readingTime?: number

    /**
     * slug
     */
    slug: string

    /**
     * Теги
     */
    tags?: string[]

    /**
     * Основное изображение статьи
     */
    cover?: ImageMeta

    /**
     * Категория статьи
     */
    category: ArticleCategory

    /**
     * Автор статьи
     */
    author?: Author

    /**
     * Массив блоков (контент)
     */
    blocks?: StrapiArticleBlock[]
}

/**
 * Тип блока статьи Strapi
 */
export type StrapiArticleBlock =
    | StrapiTextBlock
    | StrapiImageBlock
    | StrapiSliderBlock
    | StrapiQuoteBlock

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
