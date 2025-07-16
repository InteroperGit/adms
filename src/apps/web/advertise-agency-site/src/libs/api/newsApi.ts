import {Article} from "@/types/article";
import {StrapiArticle} from "@/types/strapi/strapiArticle";
import {convertStrapiArticleToArticle} from "@/libs/converters/strapiArticleConverter";
import {PaginationMeta} from "@/types/pagination";
import {newsArticles} from "@/data/newsData";
import {getNodeEnv, getStrapiUrl} from "@/libs/envUtils";

const NODE_ENV = getNodeEnv();
const RUNNING_ON_SERVER = true;
const INNER_STRAPI_URL = getStrapiUrl(RUNNING_ON_SERVER);
const PUBLIC_STRAPI_URL = getStrapiUrl(!RUNNING_ON_SERVER);
const DEV_NEWS_ARTICLES_COUNT = 100;
const DEV_MODE = "development";
const IS_DEV_MODE = NODE_ENV === DEV_MODE;

export interface NewsArticlesProps {
    page: number,
    pageSize: number,
}

export interface Result {
    articles: Article[],
    pagination: PaginationMeta
}

/**
 * Получает общее количество статей из коллекции `news-articles` в Strapi.
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
 */
export async function getNewsArticlesCount(): Promise<number> {
    const FETCH_URL = `${INNER_STRAPI_URL}/api/news-articles?pagination[pageSize]=1`;

    const res = await fetch(FETCH_URL, {
        headers: {
            'Content-Type': 'application/json'
        },
        next: {
            revalidate: 60,
        },
    });

    if (!res.ok) {
        throw new Error(`Ошибка запроса: ${res.status}`);
    }

    const json = await res.json();

    return IS_DEV_MODE
        ? DEV_NEWS_ARTICLES_COUNT
        : json?.meta?.pagination?.total ?? 0;
}

async function getNewsArticlesFromStrapi({ page, pageSize }: NewsArticlesProps): Promise<Result> {
    const FETCH_URL = `${INNER_STRAPI_URL}/api/news-articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const res = await fetch(
        FETCH_URL,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 60
            }
        }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const news: Article[] = await Promise.all(
        json.data.map((item: StrapiArticle) => (convertStrapiArticleToArticle(item, PUBLIC_STRAPI_URL)))
    );
    const pagination: PaginationMeta = json.meta.pagination;

    return { articles: news, pagination };
}

async function getDevProjectArticles(page: number,
                                     pageSize: number,
                                     total: number,
                                     strapiArticles: Article[]): Promise<Article[]> {
    const news = newsArticles.length > 0 ? newsArticles[0] : null;

    if (!news) {
        return Promise.resolve([]);
    }

    const devPageCount = Math.ceil(DEV_NEWS_ARTICLES_COUNT / pageSize);
    const articleInPageCount = page < devPageCount
        ? pageSize
        : DEV_NEWS_ARTICLES_COUNT - (devPageCount - 1) * pageSize;
    const hasNotEnoughArticles = strapiArticles.length < articleInPageCount;
    const shouldLoadDevArticles = total < DEV_NEWS_ARTICLES_COUNT;

    const result: Article[] = [];

    if (!shouldLoadDevArticles || !hasNotEnoughArticles) {
        return result;
    }

    const devPageSize = articleInPageCount - strapiArticles.length;
    const startId = strapiArticles.length > 0
        ? Math.max(...strapiArticles.map((article) => (article.id))) + 1
        : 0;

    for (let i = 0; i < devPageSize; i++) {
        const newNews: Article = {
            ...news,
            id: startId + i,
        };
        result.push(newNews);
    }

    return Promise.resolve(result);
}

/**
 * Получает список новостных статей с учетом пагинации и выбранной категории.
 *
 * В продакшене возвращает только реальные статьи из Strapi.
 * В режиме разработки (`IS_DEV_MODE`) добавляет дополнительные mock-статьи,
 * сгенерированные локально через `getDevNewsArticles`, чтобы упростить тестирование.
 *
 * Основной источник данных — метод `getNewsArticlesFromStrapi`, который делает запрос к Strapi
 * с параметрами фильтрации по категории, пагинации и размеру страницы.
 *
 * @param page - Номер страницы (для пагинации)
 * @param pageSize - Количество статей на странице
 * @returns Объект `Result`, содержащий массив статей (`news`) и метаинформацию о пагинации (`pagination`)
 */
export async function getNewsArticles({ page, pageSize }: NewsArticlesProps): Promise<Result> {
    const result = await getNewsArticlesFromStrapi({ page, pageSize });

    if (IS_DEV_MODE) {
        const devArticles = await getDevProjectArticles(
            page,
            pageSize,
            result.pagination.total,
            result.articles);
        result.articles = [...result.articles, ...devArticles];
    }

    return result;
}

/**
 * Функция `getNewsSlugs` выполняет асинхронный запрос к API Strapi для получения списка всех слагов новостных статей.
 *
 * Алгоритм работы:
 * - Запрашивает данные из Strapi с использованием пагинации.
 * - Для каждой страницы (до достижения последней) получает массив слагов (`slug`) новостных статей.
 * - Обрабатывает ответ API, извлекает слаги и добавляет их в итоговый массив.
 * - Возвращает итоговый массив слагов для всех новостных статей.
 *
 * Параметры:
 * - Не принимает параметров.
 *
 * Возвращаемое значение:
 * - Возвращает промис, который разрешается в массив строк (слагов новостных статей).
 *
 * Исключения:
 * - В случае ошибки запроса API (например, если страница не существует или сервер недоступен), будет выброшено исключение с ошибкой запроса.
 */

export async function getNewsSlugs(): Promise<string[]> {
    const slugs: string[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const res = await fetch(
            `${INNER_STRAPI_URL}/api/news-articles?pagination[page]=${page}&pagination[pageSize]=100&fields[0]=slug`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                next: {
                    revalidate: 60,
                },
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

/**
 * Функция `getNewsArticleBySlug` выполняет асинхронный запрос к API Strapi для получения статьи по слагу.
 *
 * Алгоритм работы:
 * - Выполняет GET-запрос к API Strapi с фильтром по слагу (`slug`), чтобы получить соответствующую новостную статью.
 * - Если статья найдена, она преобразуется в формат `Article` с помощью функции `convertStrapiArticleToArticle`.
 * - Если статья не найдена, возвращается `undefined`.
 *
 * Параметры:
 * - `requestSlug` (string): Слаг статьи, которую необходимо получить.
 *
 * Возвращаемое значение:
 * - Промис, который разрешается в объект типа `Article`, если статья найдена, или `undefined`, если статья не найдена.
 *
 * Исключения:
 * - В случае ошибки при запросе к API (например, недоступность сервера или ошибка в параметрах) выбрасывается исключение с текстом ошибки.
 */

export async function getNewsArticleBySlug(requestSlug: string): Promise<Article | undefined> {
    const res = await fetch(
        `${INNER_STRAPI_URL}/api/mews-articles?filters[slug][$eq]=${requestSlug}&customPopulate=nested`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 60
            }
        }
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