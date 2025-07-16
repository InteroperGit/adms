import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import { request } from 'undici';
import { getFormDataApi } from "../libs/envUtils.js";

/**
 * Прокси-маршрут для передачи данных форм в внешний API (например, Strapi).
 *
 * Принимает любые POST-запросы по пути `/forms/*` и проксирует их к внешнему
 * сервису, указанному в переменной окружения `FORM_DATA_SERVICE_API`.
 *
 * Заголовки и тело запроса передаются как есть, за исключением заголовка
 * `content-length`, который удаляется для избежания конфликтов.
 *
 * @param {FastifyInstance} fastify - Экземпляр Fastify.
 * @returns {Promise<void>}
 *
 * @example
 * fastify.register(formsRoute);
 *
 * // POST /forms/api/feedback
 * // проксируется как POST {FORM_DATA_SERVICE_API}/api/feedback
 */
export const formsRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.post('/forms/*', async (req, reply) => {
        const formsBaseUrl = getFormDataApi();

        // Извлекаем подстроку после /forms
        const formsPath = req.url.replace(/^\/forms/, '');

        // Формируем полный URL к внешнему сервису
        const formsUrl = `${formsBaseUrl}${formsPath}`;

        try {
            const jsonBody = JSON.stringify(req.body);

            const headers = {
                ...req.headers,
                'content-type': 'application/json',
            };
            delete headers['content-length'];

            const formsRes = await request(formsUrl, {
                method: req.method,
                headers,
                body: jsonBody,
            });

            // Проксируем статус
            reply.status(formsRes.statusCode);

            // Проксируем заголовки
            for (const [key, value] of Object.entries(formsRes.headers)) {
                reply.header(key, value as string);
            }

            // Проксируем тело ответа
            return formsRes.body;
        } catch (error) {
            fastify.log.error(error);
            return reply.code(502).send({
                error: 'Bad Gateway',
                details: error,
            });
        }
    });
};
