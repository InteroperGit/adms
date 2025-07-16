import {Article} from "@/types/article";
import {convertStrapiArticleToArticle} from "@/libs/converters/strapiArticleConverter";
import {StrapiArticle} from "@/types/strapi/strapiArticle";
import {PaginationMeta} from "@/types/pagination";
import {getStrapiUrl} from "@/libs/envUtils";

const INNER_STRAPI_URL = getStrapiUrl(true);
const PUBLIC_STRAPI_URL = getStrapiUrl(false);

interface Result {
    articles: Article[],
    pagination: PaginationMeta
}

/**
 * Аргументы для paging
 */
export interface PaginationArguments {
    page: number;
    pageSize: number;
}

/**
 * Получить список всех статей
 * @param page
 * @param pageSize
 */
export async function getArticles({ page = 1, pageSize }: PaginationArguments): Promise<Result> {
    const res = await fetch(
        `${INNER_STRAPI_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const articles: Article[] = await Promise.all(
        json.data.map((item: StrapiArticle) => (
            convertStrapiArticleToArticle(item, PUBLIC_STRAPI_URL)))
    );
    const pagination: PaginationMeta = json.meta?.pagination;

    return { articles, pagination };
}

/**
 * Получить статью по slug
 * @param requestSlug
 */
export async function getArticleBySlug(requestSlug: string): Promise<Article | undefined> {
    const res = await fetch(
        `${INNER_STRAPI_URL}/api/articles?filters[slug][$eq]=${requestSlug}&customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const strapiArticles: StrapiArticle[] = json.data;

    if (strapiArticles.length === 0) {
        return undefined;
    }

    const strapiArticle = strapiArticles[0];
    return convertStrapiArticleToArticle(strapiArticle, PUBLIC_STRAPI_URL);
}