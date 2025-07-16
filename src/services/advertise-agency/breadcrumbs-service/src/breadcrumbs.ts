import {BreadcrumbItem} from "./types/breadcrumbs.js";
import {getArticleTitle, getNewsTitle, getPortfolioTitle, getServiceTitle} from "./strapiApi.js";

const getBaseBreadcrumbs = (): BreadcrumbItem => {
    return { title: "Главная", href: "/" }
}

const getStrapiBreadcrumbs = async (segments: string[],
                                    entityBreadcrumb: BreadcrumbItem,
                                    slugCondition: () => boolean,
                                    getTitle: (slug: string) => Promise<string | null>): Promise<BreadcrumbItem[]> => {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    if (!slugCondition()) {
        result.push({ ...entityBreadcrumb, href: undefined, isCurrent: true });
        return Promise.resolve(result);
    }
    else {
        result.push(entityBreadcrumb);
    }

    try {
        const slug = segments[1];
        const title = await getTitle(slug);

        if (!title) {
            return result;
        }

        result.push({
            title: title,
            isCurrent: true
        })
    }
    catch (error) {
        console.error(error);
        throw "Failed to get breadcrumbs";
    }

    return result;
}

const getServiceBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const serviceBreadcrumbs = { title: "Услуги", href: "/services" };
    const slugCondition = () => (segments.length > 1);
    return await getStrapiBreadcrumbs(segments, serviceBreadcrumbs, slugCondition, getServiceTitle);
}

const getPortfolioBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const portfolioBreadcrumbs = { title: "Портфолио", href: "/portfolio/category/all/1" }
    const slugCondition = () => (segments.length > 1 && segments[1] !== "category");
    return await getStrapiBreadcrumbs(segments, portfolioBreadcrumbs, slugCondition, getPortfolioTitle);
}

const getArticleBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const articleBreadcrumbs = { title: "Статьи", href: "/articles/page/1" };
    const slugCondition = () => (segments.length > 1 && segments[1] !== "page");
    return await getStrapiBreadcrumbs(segments, articleBreadcrumbs, slugCondition, getArticleTitle);
}

const getNewsBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const newsBreadcrumbs = { title: "Новости", href: "/news/page/1" };
    const slugCondition = () => (segments.length > 1 && segments[1] !== "page");
    return await getStrapiBreadcrumbs(segments, newsBreadcrumbs, slugCondition, getNewsTitle);
}

const getContactsBreadcrumbs = async (): Promise<BreadcrumbItem[]> => {
    return [
        getBaseBreadcrumbs(),
        {title: "Контакты", href: "/contacts", isCurrent: true},
    ];
}

/**
 * Формирует массив хлебных крошек (breadcrumb) для заданного URL-пути.
 *
 * @param path - строка пути URL (например, "/services/design", "/articles/some-article")
 * @returns Promise, который разрешается в массив элементов BreadcrumbItem,
 *          описывающих навигационные уровни от главной страницы до текущей.
 *
 * Логика работы:
 * - Разбивает строку path по символу "/" и фильтрует пустые сегменты.
 * - Определяет корневую часть пути (первый сегмент).
 * - В зависимости от корневой части вызывает соответствующую функцию для
 *   построения хлебных крошек для раздела (услуги, портфолио, статьи, новости, контакты).
 * - Каждая из функций получает сегменты пути, проверяет условия для добавления
 *   текущей страницы, при необходимости делает асинхронный запрос к Strapi
 *   для получения заголовка конкретной записи по slug.
 * - В случае неизвестного корня возвращает пустой массив.
 *
 * Особенности:
 * - Главная страница ("Главная") всегда добавляется первой.
 * - Если текущая страница — раздел без конкретной записи, она помечается как текущая.
 * - Если текущая страница — конкретная запись (статья, услуга и т.д.), добавляется дополнительный уровень с заголовком.
 *
 * Пример:
 * Для пути "/articles/how-to-code" результатом может быть массив:
 * [
 *   { title: "Главная", href: "/" },
 *   { title: "Статьи", href: "/articles/page/1" },
 *   { title: "How to code", isCurrent: true }
 * ]
 */
export const getBreadcrumbs= async (path: string): Promise<BreadcrumbItem[]> => {
    const segments = path.split("/").filter(Boolean);
    const rootPage = segments[0];

    switch (rootPage) {
        case "services":
            return getServiceBreadcrumbs(segments);
        case "portfolio":
            return getPortfolioBreadcrumbs(segments);
        case "articles":
            return getArticleBreadcrumbs(segments);
        case "news":
            return getNewsBreadcrumbs(segments);
        case "contacts":
            return getContactsBreadcrumbs();
        default:
            return Promise.resolve([]);
    }
}