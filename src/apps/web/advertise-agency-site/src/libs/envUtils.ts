import {DEFAULT_PORTFOLIO_PAGE_SIZE} from "@/config/constants";

/**
 * Возвращает публичный URL API для получения хлебных крошек.
 *
 * Использует переменную окружения NEXT_PUBLIC_BREADCRUMBS_URL, которая
 * должна быть определена в .env файле и доступна как на сервере, так и на клиенте.
 *
 * @throws Ошибка, если переменная окружения отсутствует.
 * @returns {string} Полный URL для запроса данных хлебных крошек.
 */
export const getBreadcrumbsApiUrl = (runningOnServer: boolean): string => {
    const BREADCRUMBS_URL = runningOnServer
        ? process.env.BREADCRUMBS_SERVICE_URL
        : process.env.NEXT_PUBLIC_BREADCRUMBS_SERVICE_URL;

    if (!BREADCRUMBS_URL) {
        throw new Error("BREADCRUMB_URL environment variable is missing");
    }

    return BREADCRUMBS_URL;
}

/**
 * Возвращает публичный URL API для отправки или получения данных из формы.
 *
 * Использует переменную окружения NEXT_PUBLIC_FORM_DATA_URL, которая
 * должна быть определена в .env файле для публичного доступа.
 *
 * @throws Ошибка, если переменная окружения отсутствует.
 * @returns {string} Полный URL для работы с сервисом данных формы.
 */
export const getFormDataApiUrl = (runningOnServer: boolean): string => {
    const FORM_DATA_URL = runningOnServer
        ? process.env.FORM_DATA_SERVICE_URL
        : process.env.NEXT_PUBLIC_FORM_DATA_SERVICE_URL;

    if (!FORM_DATA_URL) {
        throw new Error("Failed to get ford-data service url");
    }

    return FORM_DATA_URL;
}

/**
 * Возвращает URL API Strapi в зависимости от среды выполнения.
 *
 * - На сервере (Node.js) используется STRAPI_SERVICE_URL (например, для серверного PI).
 * - На клиенте (браузер) используется NEXT_PUBLIC_STRAPI_URL (для клиентского API).
 *
 * @throws Ошибка, если необходимая переменная окружения не определена.
 * @returns {string} URL API Strapi для текущего контекста выполнения.
 */
export const getStrapiUrl = (runningOnServer: boolean): string => {
    const STRAPI_URL = runningOnServer
        ? process.env.STRAPI_SERVICE_URL
        : process.env.NEXT_PUBLIC_STRAPI_SERVICE_URL;

    if (!STRAPI_URL) {
        throw new Error("Strapi URL environment variable is missing");
    }

    return STRAPI_URL;
}

/**
 * Возвращает текущее значение переменной окружения NODE_ENV.
 *
 * NODE_ENV определяет среду выполнения приложения (например: 'development', 'production').
 *
 * Используется для изменения поведения приложения в зависимости от окружения.
 *
 * @throws Ошибка, если NODE_ENV не задан.
 * @returns {string} Строка, указывающая тип окружения.
 */
export const getNodeEnv = (): string => {
    const NODE_ENV = process.env.NODE_ENV;

    if (!NODE_ENV) {
        throw new Error("NODE_ENV environment variable is missing");
    }

    return NODE_ENV;
}

/**
 * Возвращает идентификатор компании Яндекс для использования в интеграциях (например, Яндекс Метрика, API).
 *
 * Использует серверную переменную окружения YANDEX_COMPANY_ID.
 *
 * @throws Ошибка, если идентификатор отсутствует в переменных окружения.
 * @returns {string} ID компании Яндекс.
 */
export const getYandexCompanyId = (): string => {
    const YANDEX_COMPANY_ID = process.env.YANDEX_COMPANY_ID;

    if (!YANDEX_COMPANY_ID) {
        throw new Error("YANDEX_COMPANY_ID environment variable is missing");
    }

    return YANDEX_COMPANY_ID;
}

/**
 * Возвращает количество элементов на одной странице портфолио.
 *
 * Использует переменную PORTFOLIO_PAGE_SIZE. Если переменная не задана или не является числом,
 * будет возвращено значение по умолчанию DEFAULT_PORTFOLIO_PAGE_SIZE.
 *
 * Преобразует строку из переменной окружения в число.
 *
 * @returns {number} Количество элементов на странице портфолио.
 */
export const getPortfolioPageSize = (): number => {
    return process.env.PORTFOLIO_PAGE_SIZE && !isNaN(Number(process.env.PORTFOLIO_PAGE_SIZE))
        ? parseInt(process.env.PORTFOLIO_PAGE_SIZE, 10)
        : DEFAULT_PORTFOLIO_PAGE_SIZE;
}