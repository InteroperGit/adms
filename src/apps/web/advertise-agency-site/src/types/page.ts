/**
 * Параметры
 */
interface Params {
    slug: string;
}

/**
 * Свойства страницы
 */
export interface PageProps {
    params: Params
}

/**
 * Свойства страницы
 */
export interface PromisePageProps {
    params: Promise<Params>
}