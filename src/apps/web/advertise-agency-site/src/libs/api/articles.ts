import {articles} from "@/data/article-data";
import {Article} from "@/types/article";
import {ImageFormat, ImageFormats} from "@/types/image";

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

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getAllArticles({ page = 1, pageSize = 10 } = {}): Promise<Result> {
    const res = await fetch(
        `${STRAPI_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();

    const articles: Article[] = json.data.map((item: Article) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        slug: item.slug,
        category: item.category,
        cover: item.cover
            ? {
                ...item.cover,
                url: item.cover?.formats?.large ?? item.cover?.formats?.medium ?? item?.cover?.formats?.small,
                // Преобразуем все относительные URL в абсолютные
                formats: item.cover.formats
                    ? Object.keys(item.cover.formats).reduce((acc, key) => {
                        const typedKey = key as keyof ImageFormats;
                        const format: ImageFormat | null = item?.cover?.formats?.[typedKey] ?? null;

                        if (format) {
                            acc[typedKey] = {
                                ...format,
                                url: format.url.startsWith('http')
                                    ? format.url
                                    : `${STRAPI_URL}${format.url}`, // Преобразуем в абсолютный URL для каждого формата
                            };
                        }

                        return acc;
                    }, {} as ImageFormats)
                    : null
            }
            : null // Если cover пустое, то возвращаем null
    }));

    const pagination: PaginationMeta = json.meta.pagination;

    return { articles, pagination };
}

export const getArticleBySlug = (requestSlug: string): Promise<Article | undefined> => {
    return Promise.resolve(articles.find(({ slug }) => requestSlug === slug));
}