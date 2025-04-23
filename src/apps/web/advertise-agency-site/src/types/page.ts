/**
 * Параметры slug
 */
export interface PageSlugParams {
    slug: string;
}

/**
 * Свойства страницы со slug
 */
export interface PageSlugProps {
    params: Promise<PageSlugParams>;
}

/**
 * Параметры category, page
 */
export interface PageCategoryParams {
    category: string;
    page: string;
}

/**
 * Свойства страницы с category, page
 */
export interface PageCategoryProps {
    params: Promise<PageCategoryParams>;
}