import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";
import {Author} from "@/types/author";
import {StrapiArticleCategory} from "@/types/strapi/strapiArticleCategory";
import {StrapiArticleBlock} from "@/types/strapi/strapiArticleBlock";
import {StrapiSeo} from "@/types/strapi/strapiSeo";

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
    category: StrapiArticleCategory

    /**
     * Автор статьи
     */
    author?: Author

    /**
     * Дата публикации
     */
    publishDate?: string;

    /**
     * Время чтения в минутах
     */
    readingTime?: number

    /**
     * Массив блоков (контент)
     */
    blocks?: StrapiArticleBlock[]

    /**
     * SEO
     */
    seo?: StrapiSeo;
}