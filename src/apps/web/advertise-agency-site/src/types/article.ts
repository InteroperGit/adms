import {ProjectPreview} from "@/types/project";
import {ImageMeta} from "@/types/image";
import {Entity} from "@/types/base";
import {Author} from "@/types/author";

/**
 * Категория статьи
 */
export interface ArticleCategory extends Entity {
    /**
     * Название
     */
    name: string;

    /**
     * Заголовок
     */
    title: string;

    /**
     * slug
     */
    slug: string;
}

/**
 * Основной интерфейс статьи
 */
export interface Article extends Entity {
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
     * Контент статьи в виде массива блоков
     */
    blocks?: ArticleBlock[]

    /**
     * SEO-метаданные
     */
    seo?: ArticleSEO

    /**
     * Флаг популярной статьи
     */
    isFeatured?: boolean

    /**
     * Флаг новинки (опционально)
     */
    isNew?: boolean

    /**
     * Связанные статьи (опционально)
     */
    relatedArticles?: Article[]
}

/**
 * Блоки контента статьи (union-тип)
 */
export type ArticleBlock =
    | TextBlock
    | ImageBlock
    | ImageGalleryBlock
    | VideoBlock
    | PortfolioBlock
    | QuoteBlock
    | CodeBlock
    | TableBlock
    | DividerBlock
    | EmbedBlock
    | ArticleFormBlock

/**
 * Текстовый блок
 */
export interface TextBlock {
    type: 'text'
    content: string // HTML-форматированный текст
    align?: 'left' | 'center' | 'right'
}

/**
 * Блок с изображением
 */
export interface ImageBlock {
    type: 'image'
    image: ImageMeta,
    align?: 'left' | 'center' | 'right'
    fullWidth?: boolean
}

/**
 * Галерея изображений
 */
export interface ImageGalleryBlock {
    type: 'imageGallery';
    images: ImageMeta[];
    layout: 'grid' | 'carousel' | 'masonry';
    columns?: number; // Для grid layout
}

/**
 * Блок с видео
 */
export interface VideoBlock {
    type: 'video'
    url: string
    source: 'youtube' | 'vimeo' | 'custom'
    caption?: string
    aspectRatio?: string // например "16:9"
}

/**
 * Портфолио
 */
export interface PortfolioBlock {
    type: 'portfolio';
    projects: ProjectPreview[];
    columns?: number;
}

/**
 * Блок цитаты
 */
export interface QuoteBlock {
    type: 'quote'
    text: string
    author?: string
    source?: string
}

/**
 * Блок с кодом
 */
export interface CodeBlock {
    type: 'code'
    code: string
    language?: string
    showLineNumbers?: boolean
}

/**
 * Таблица
 */
export interface TableBlock {
    type: 'table'
    headers: string[]
    rows: string[][]
    align?: ('left' | 'center' | 'right')[]
}

/**
 * Разделитель
 */
export interface DividerBlock {
    type: 'divider'
    style?: 'solid' | 'dashed' | 'dotted'
}

/**
 * Встроенный контент (iframe)
 */
export interface EmbedBlock {
    type: 'embed'
    html?: string;  // if you want to support raw HTML
    url?: string;   // if you want to support URL-based embeds
    provider?: string
    width?: string
    height?: string
}

/**
 * Компонент Форма
 */
export interface ArticleFormBlock {
    type: 'form',
    formType: ArticleFormTypeKey       // Ключ типа формы
    title?: string              // Заголовок формы (переопределение по желанию)
}

/**
 * Тип формы
 */
export type ArticleFormTypeKey = 'lightLetters' | 'banner' | 'signboard' // и т.д.

/**
 * SEO-метаданные статьи
 */
export interface ArticleSEO {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
}