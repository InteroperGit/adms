import {Article} from "@/types/article";
import {PaginationMeta} from "@/types/pagination";
import {StrapiArticle} from "@/types/strapi/strapiArticle";
import {convertStrapiArticleToArticle} from "@/libs/converters/strapiArticleConverter";
import {projects} from "@/data/projectsData";
import {getServiceCategories} from "@/libs/api/servicesApi";
import {ServiceCategory} from "@/types/service";
import {ALL_SERVICE_CATEGORY_NAME} from "@/config/constants";

const NODE_ENV = process.env.NODE_ENV;
const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;
const DEV_PROJECT_ARTICLES_COUNT = 100;
const DEV_MODE = "development";
const IS_DEV_MODE = NODE_ENV === DEV_MODE;

export interface ProjectArticlesProps {
    category: string,
    page: number,
    pageSize: number,
}

export interface Result {
    articles: Article[],
    pagination: PaginationMeta
}

/**
 * Получает общее количество статей из коллекции `project-articles` в Strapi.
 *
 * Отправляет HTTP-запрос с параметром `pagination[pageSize]=1`, чтобы минимизировать объем передаваемых данных,
 * и использует объект `meta.pagination.total` из ответа для получения общего количества записей.
 *
 * Метод полезен для:
 * - Подсчета количества страниц при пагинации
 * - Статистических или навигационных элементов на фронтенде
 * - Валидации наличия контента
 *
 * В случае ошибки возвращает 0 и логирует ее в консоль.
 *
 * Требует переменной окружения `NEXT_PUBLIC_STRAPI_API_URL`.
 *
 * @param category - Категория проектоа
 */
export async function getProjectsArticlesCount(category: string = ALL_SERVICE_CATEGORY_NAME): Promise<number> {
    const FETCH_URL = category === ALL_SERVICE_CATEGORY_NAME
        ? `${STRAPI_URL}/api/project-articles?pagination[pageSize]=1`
        : `${STRAPI_URL}/api/project-articles?filters[category][name][$eq]=${category}&pagination[pageSize]=1`

    const res = await fetch(FETCH_URL, {
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store', // чтобы не кешировалось в dev
    });

    if (!res.ok) {
        throw new Error(`Ошибка запроса: ${res.status}`);
    }

    const json = await res.json();

    return IS_DEV_MODE
        ? DEV_PROJECT_ARTICLES_COUNT
        : json?.meta?.pagination?.total ?? 0;
}

export async function getProjectSlugs(): Promise<string[]> {
    const slugs: string[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const res = await fetch(
            `${STRAPI_URL}/api/project-articles?pagination[page]=${page}&pagination[pageSize]=100&fields[0]=slug`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store", // отключаем кэш в dev
            }
        );

        if (!res.ok) {
            throw new Error(`Ошибка при получении slugs: ${res.status}`);
        }

        const json = await res.json();

        const pageSlugs = json.data.map(
            (item: { slug: string }) => item.slug
        );
        slugs.push(...pageSlugs);

        totalPages = json.meta.pagination.pageCount;
        page++;
    } while (page <= totalPages);

    return slugs;
}

async function getProjectArticlesFromStrapi({ category, page, pageSize }: ProjectArticlesProps): Promise<Result> {
    const FETCH_URL = category === ALL_SERVICE_CATEGORY_NAME
        ? `${STRAPI_URL}/api/project-articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        : `${STRAPI_URL}/api/project-articles?populate=*&filters[category][name][$eq]=${category}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const res = await fetch(
        FETCH_URL,
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

async function getDevProjectArticles(page: number,
                                     pageSize: number,
                                     total: number,
                                     strapiArticles: Article[],
                                     currentServiceCategory: string,
                                     serviceCategories: ServiceCategory[]): Promise<Article[]> {
    const project = projects.length > 0 ? projects[0] : null;

    if (!project) {
        return Promise.resolve([]);
    }

    const devPageCount = Math.ceil(DEV_PROJECT_ARTICLES_COUNT / pageSize);
    const articleInPageCount = page < devPageCount
        ? pageSize
        : DEV_PROJECT_ARTICLES_COUNT - (devPageCount - 1) * pageSize;
    const hasNotEnoughArticles = strapiArticles.length < articleInPageCount;
    const shouldLoadDevArticles = total < DEV_PROJECT_ARTICLES_COUNT;

    const result: Article[] = [];

    if (!shouldLoadDevArticles || !hasNotEnoughArticles) {
        return result;
    }

    const devPageSize = articleInPageCount - strapiArticles.length;
    const startId = strapiArticles.length > 0
        ? Math.max(...strapiArticles.map((article) => (article.id))) + 1
        : 0;

    for (let i = 0; i < devPageSize; i++) {
        const randomIndex = Math.floor(Math.random() * serviceCategories.length);
        const serviceCategory = currentServiceCategory === ALL_SERVICE_CATEGORY_NAME
            ? serviceCategories[randomIndex]
            : serviceCategories.find((category) => category.name === currentServiceCategory);

        if (!serviceCategory) {
            throw new Error(`Failed to find service category: ${currentServiceCategory}`);
        }

        const newProject: Article = {
            ...project,
            id: startId + i,
            category: {
                ...project.category,
                id: project.category.id + i,
                name: serviceCategory.name,
                title: serviceCategory.title || "",
            }
        };
        result.push(newProject);
    }

    return Promise.resolve(result);
}

export async function getProjectArticles({ category, page, pageSize }: ProjectArticlesProps): Promise<Result> {
    const result = await getProjectArticlesFromStrapi({ category, page, pageSize });

    if (IS_DEV_MODE) {
        const serviceCategories: ServiceCategory[] = await getServiceCategories("nonheader");
        const devArticles = await getDevProjectArticles(
            page,
            pageSize,
            result.pagination.total,
            result.articles,
            category,
            serviceCategories);
        result.articles = [...result.articles, ...devArticles];
    }

    return result;
}

export async function getProjectArticleBySlug(requestSlug: string): Promise<Article | undefined> {
    // return Promise.resolve(projects.find(({ slug }) => requestSlug === slug));
    const res = await fetch(
        `${STRAPI_URL}/api/project-articles?filters[slug][$eq]=${requestSlug}&customPopulate=nested`,
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