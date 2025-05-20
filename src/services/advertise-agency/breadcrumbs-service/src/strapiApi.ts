import { HttpClient } from './libs/httpClient';
import {getStrapiApi} from "./libs/envUtils";

let http: HttpClient | null = null;

function getHttp(): HttpClient {
    if (!http) {
        const url = getStrapiApi();
        http = new HttpClient(url);
    }
    return http;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
}

interface StrapiResponse<T> {
    data: Article[];
}

const getTitle = async (query: string): Promise<string | null> => {
    const httpClient = getHttp();
    const res = await httpClient.get<StrapiResponse<Article>>(query);

    if (!res.data || res.data.length < 1) {
        return null;
    }

    const article = res.data[0] as Article;
    return article.title ?? null;
}

/**
 * Возвращает заголовок статьи из коллекции "articles" Strapi по переданному slug.
 *
 * @param slug - уникальный идентификатор статьи (slug)
 * @returns заголовок статьи или null, если статья не найдена
 *
 * Формирует запрос к Strapi с фильтром по полю slug и возвращает только поле title.
 * Использует вспомогательную функцию getTitle для выполнения HTTP-запроса.
 */
export const getArticleTitle = async (slug: string): Promise<string | null> => {
    const query = `/articles?filters[slug][$eq]=${slug}&fields=title,slug`;
    return await getTitle(query);
}

/**
 * Возвращает заголовок услуги из коллекции "services" Strapi по переданному slug.
 *
 * @param slug - уникальный идентификатор услуги (slug)
 * @returns заголовок услуги или null, если услуга не найдена
 *
 * Запрашивает сервисы с фильтром по slug, возвращая только поля title и slug.
 * Внутри используется универсальная функция getTitle.
 */
export const getServiceTitle = async (slug: string): Promise<string | null> => {
    const query = `/service-articles?filters[slug][$eq]=${slug}&fields=title,slug`;
    return await getTitle(query);
}

/**
 * Возвращает заголовок новости из коллекции "news" Strapi по переданному slug.
 *
 * @param slug - уникальный идентификатор новости (slug)
 * @returns заголовок новости или null, если новость не найдена
 *
 * Делает запрос к endpoint news с фильтром по slug и ограничением возвращаемых полей.
 * Использует getTitle для получения данных.
 */
export const getNewsTitle = async (slug: string): Promise<string | null> => {
    const query = `/news-articles?filters[slug][$eq]=${slug}&fields=title,slug`;
    return await getTitle(query);
}

/**
 * Возвращает заголовок портфолио из коллекции "portfolio" Strapi по переданному slug.
 *
 * @param slug - уникальный идентификатор записи портфолио (slug)
 * @returns заголовок портфолио или null, если запись не найдена
 *
 * Формирует запрос к endpoint portfolio с фильтрацией по slug.
 * Использует универсальную функцию getTitle для выполнения запроса и обработки ответа.
 */
export const getPortfolioTitle = async (slug: string): Promise<string | null> => {
    const query = `/project-articles?filters[slug][$eq]=${slug}&fields=title,slug`;
    return await getTitle(query);
}