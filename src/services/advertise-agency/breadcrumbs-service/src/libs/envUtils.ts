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
export const getStrapiApi = (): string => {
    const STRAPI_URL = process.env.STRAPI_URL;

    if (!STRAPI_URL) {
        throw new Error("STRAPI_API environment variable required");
    }

    return STRAPI_URL + "/api";
}