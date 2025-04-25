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
 * SEO-метаданные статьи
 */
export interface ArticleSEO {
    title?: string;
    description?: string;
    ogImage?: ImageMeta;
}

/**
 * Основной интерфейс статьи
 */
export interface Article extends Entity {
    /**
     * Заголовок статьи (h1)
     */
    title: string;

    /**
     * Краткое описание
     */
    description: string;

    /**
     * Время чтения в минутах
     */
    readingTime?: number;

    /**
     * slug
     */
    slug: string;

    /**
     * Теги
     */
    tags?: string[];

    /**
     * Основное изображение статьи
     */
    cover?: ImageMeta;

    /**
     * Категория статьи
     */
    category: ArticleCategory;

    /**
     * Автор статьи
     */
    author?: Author;

    /**
     * Контент статьи в виде массива блоков
     */
    blocks?: ArticleBlock[];

    /**
     * SEO-метаданные
     */
    seo?: ArticleSEO;

    /**
     * Флаг популярной статьи
     */
    isFeatured?: boolean;

    /**
     * Флаг новинки (опционально)
     */
    isNew?: boolean;

    /**
     * Связанные статьи (опционально)
     */
    relatedArticles?: Article[];
}

/**
 * Блоки контента статьи (union-тип)
 */
export type ArticleBlock =
    | ArticleTextBlock
    | ArticleImageBlock
    | ArticleImageGalleryBlock
    | ArticleVideoBlock
    | ArticlePortfolioBlock
    | ArticleQuoteBlock
    | ArticleCodeBlock
    | ArticleTableBlock
    | ArticleDividerBlock
    | ArticleEmbedBlock
    | ArticleFormBlock

/**
 * Текстовый блок
 */
export interface ArticleTextBlock {
    type: 'text';
    content: string; // HTML-форматированный текст
    align?: 'left' | 'center' | 'right';
}

/**
 * Блок с изображением
 */
export interface ArticleImageBlock {
    type: 'image';
    image: ImageMeta;
    align?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
}

/**
 * Галерея изображений
 */
export interface ArticleImageGalleryBlock {
    type: 'imageGallery';
    images: ImageMeta[];
    layout: 'grid' | 'carousel' | 'masonry';
    columns?: number; // Для grid layout
}

/**
 * Блок с видео
 */
export interface ArticleVideoBlock {
    type: 'video';
    url: string;
    source: 'youtube' | 'vimeo' | 'custom';
    caption?: string;
    aspectRatio?: string; // например "16:9"
}

/**
 * Портфолио
 */
export interface ArticlePortfolioBlock {
    type: 'portfolio';
    projects: Article[];
    columns?: number;
}

/**
 * Блок цитаты
 */
export interface ArticleQuoteBlock {
    type: 'quote';
    text: string;
    author?: string;
    source?: string;
}

/**
 * Блок с кодом
 */
export interface ArticleCodeBlock {
    type: 'code';
    code: string;
    language?: string;
    showLineNumbers?: boolean;
}

/**
 * Таблица
 */
export interface ArticleTableBlock {
    type: 'table';
    headers: string[];
    rows: string[][];
    align?: ('left' | 'center' | 'right')[];
}

/**
 * Разделитель
 */
export interface ArticleDividerBlock {
    type: 'divider';
    style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Встроенный контент (iframe)
 */
export interface ArticleEmbedBlock {
    type: 'embed';
    html?: string;  // if you want to support raw HTML
    url?: string;   // if you want to support URL-based embeds
    provider?: string;
    width?: string;
    height?: string;
}

/**
 * Компонент Форма
 */
export interface ArticleFormBlock {
    type: 'form';
    formType: ArticleFormTypeKey;       // Ключ типа формы
    title?: string;              // Заголовок формы (переопределение по желанию)
}

/**
 * Тип формы
 */
export type ArticleFormTypeKey =
    'light-letters'
    | 'light-boxes'
    | 'brackets'
    | 'technical-design'
    | 'approval'
    | 'installation'
    | 'interior-logo'
    | 'navigation'
    | 'stands-signs'
    | 'opening-hours'
    | 'neon-signs'
    | 'pavilion-decoration'
    | 'exhibition-decoration'
    | 'souvenir-products-branding'
    | 'clothing-branding'
    | 'business-cards'
    | 'flyers'
    | 'euro-booklets'
    | 'postcards'