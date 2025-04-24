import {Article} from "@/types/article";
import {convertStrapiArticleToArticle} from "@/libs/converters/strapiArticleConverter";
import {StrapiArticle} from "@/types/strapi/strapiArticle";

interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

interface Result {
    articles: Article[],
    pagination: PaginationMeta
}

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

/**
 * Получить список всех статей
 * @param page
 * @param pageSize
 */
export async function getAllArticles({ page = 1, pageSize = 10 } = {}): Promise<Result> {
    const res = await fetch(
        `${STRAPI_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const articles: Article[] = await Promise.all(
        json.data.map((item: StrapiArticle) => (convertStrapiArticleToArticle(item, STRAPI_URL)))
    );
    const pagination: PaginationMeta = json.meta.pagination;

    return { articles, pagination };
}

/**
 * Получить статью по slug
 * @param requestSlug
 */
export async function getArticleBySlug(requestSlug: string): Promise<Article | undefined> {
    const res = await fetch(
        `${STRAPI_URL}/api/articles?filters[slug][$eq]=${requestSlug}&customPopulate=nested`,
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
    return convertStrapiArticleToArticle(strapiArticle, STRAPI_URL);
}