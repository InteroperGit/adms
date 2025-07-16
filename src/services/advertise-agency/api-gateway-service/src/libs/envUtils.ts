/**
 * Получает и валидирует значение переменной окружения SERVICE_PORT.
 *
 * Значение должно быть целым числом от 1 до 65535, иначе будет выброшено
 * исключение. Используется для указания порта, на котором запускается
 * сервис.
 *
 * Это позволяет избежать ситуаций, когда порт не указан или некорректен.
 *
 * @throws {Error} Если переменная не указана или имеет неверный формат.
 * @returns {number} Корректный номер порта.
 *
 * @example
 * const port = getServicePort();
 * fastify.listen({ port });
 */
export const getServicePort = (): number => {
    const rawPort = process.env.SERVICE_PORT;

    if (!rawPort) {
        throw new Error("SERVICE_PORT environment variable required");
    }

    const SERVICE_PORT = Number(rawPort);

    if (!Number.isInteger(SERVICE_PORT) || SERVICE_PORT <= 0 || SERVICE_PORT > 65535) {
        throw new Error("SERVICE_PORT must be a valid integer between 1 and 65535");
    }

    return SERVICE_PORT;
}

/**
 * Получает значение переменной окружения STRAPI_API.
 *
 * Используется для определения базового URL сервера Strapi,
 * с которым взаимодействует API Gateway.
 *
 * Значение должно быть валидным URL, но проверка формата не выполняется —
 * предполагается, что значение корректно указано в окружении.
 *
 * @throws {Error} Если переменная не указана.
 * @returns {string} URL до Strapi API.
 *
 * @example
 * const strapiBaseUrl = getStrapiApi();
 * const res = await fetch(`${strapiBaseUrl}/api/articles`);
 */
export const getStrapiUrl = (): string => {
    const STRAPI_URL = process.env.STRAPI_URL;

    if (!STRAPI_URL) {
        throw new Error("STRAPI_URL environment variable required");
    }

    return STRAPI_URL;
}

/**
 * Получает значение переменной окружения BREADCRUMBS_API.
 *
 * Используется для указания базового URL сервиса хлебных крошек,
 * с которым взаимодействует фронтенд через API Gateway.
 *
 * Значение должно быть валидным URL. Формат не проверяется,
 * предполагается, что он корректно указан в окружении.
 *
 * @throws {Error} Если переменная не задана.
 * @returns {string} URL до Breadcrumbs API.
 *
 * @example
 * const breadcrumbsUrl = getBreadcrumbsApi();
 * const res = await fetch(`${breadcrumbsUrl}/current`);
 */
export const getBreadcrumbsApi = (): string => {
    const BREADCRUMBS_API = process.env.BREADCRUMBS_SERVICE_API;

    if (!BREADCRUMBS_API) {
        throw new Error("BREADCRUMBS_API environment variable required");
    }

    return BREADCRUMBS_API;
}

/**
 * Получает URL API сервиса для работы с данными форм из переменных окружения.
 *
 * Бросает ошибку, если переменная окружения не определена.
 *
 * @returns {string} URL API сервиса.
 * @throws {Error} Если переменная окружения FORM_DATA_SERVICE_API не задана.
 *
 * @example
 * try {
 *   const apiUrl = getFormDataApi();
 *   console.log(`API URL: ${apiUrl}`);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const getFormDataApi = (): string => {
    const FORM_DATA_API = process.env.FORM_DATA_SERVICE_API;

    if (!FORM_DATA_API) {
        throw new Error("FORM_DATA_API environment variable required");
    }

    return FORM_DATA_API;
}