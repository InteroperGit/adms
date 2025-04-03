import {ProjectPreview} from "@/types/project";

/**
 * Основной интерфейс статьи
 */
export interface Article {
    /**
     * Уникальный идентификатор статьи
     */
    id: string

    /**
     * Заголовок статьи (h1)
     */
    title: string

    /**
     * Краткое описание для превью
     */
    excerpt: string

    /**
     * Дата создания в формате ISO (YYYY-MM-DD)
     */
    createdAt: string

    /**
     * Дата обновления в формате ISO (YYYY-MM-DD)
     */
    updatedAt: string

    /**
     * Дата публикации в формате ISO (YYYY-MM-DD)
     */
    publishedAt: string

    /**
     * Время чтения в минутах
     */
    readingTime: number

    /**
     * URL-адрес статьи (slug)
     */
    slug: string

    /**
     * Теги
     */
    tags: string[]

    /**
     * Основное изображение статьи
     */
    coverImage: {
        url: string
        alt: string
        width?: number
        height?: number
    }

    /**
     * Категория статьи
     */
    category: {
        name: string
        slug: string
    }

    /**
     * Автор статьи
     */
    author: {
        name: string
        avatar?: string
        position?: string
    }

    /**
     * Контент статьи в виде массива блоков
     */
    content: ArticleBlock[]

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
    relatedArticles?: ArticlePreview[]
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
    url: string
    alt: string
    caption?: string
    width?: number
    height?: number
    align?: 'left' | 'center' | 'right'
    fullWidth?: boolean
}

/**
 * Галерея изображений
 */
export interface ImageGalleryBlock {
    type: 'imageGallery';
    images: {
        url: string;
        alt: string;
        caption?: string;
        width?: number;
        height?: number;
    }[];
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
 * SEO-метаданные статьи
 */
export interface ArticleSEO {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
}

/**
 * Превью статьи
 */
export interface ArticlePreview {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    imageUrl: string
}