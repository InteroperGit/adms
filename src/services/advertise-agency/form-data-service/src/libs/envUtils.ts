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

export const getNodeEnv = (): string => {
    const nodeEnv = process.env.NODE_ENV;

    if (!nodeEnv) {
        throw new Error("NODE_ENV environment variable required");
    }

    return nodeEnv as string;
}
