import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import { request } from 'undici';
import {getStrapiApi} from "../libs/envUtils";

/**
 * Плагин Fastify, реализующий маршрут для получения данных из Strapi
 * через прямое проксирование с минимальной обработкой.
 *
 * Пример:
 * GET /api/strapi/articles → GET http://localhost:1337/api/articles
 *
 * @type {FastifyPluginAsync}
 */
export const strapiRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/strapi/*', async (req, reply) => {
        const strapiBaseUrl = getStrapiApi();

        // Извлекаем подстроку после /strapi
        const strapiPath = req.url.replace(/^\/strapi/, '');

        // Формируем полный URL к Strapi
        const strapiUrl = `${strapiBaseUrl}${strapiPath}`;

        try {
            const strapiRes = await request(strapiUrl, {
                method: req.method,
                headers: req.headers,
                body: req.raw,
            });

            // Проксируем статус
            reply.status(strapiRes.statusCode);

            // Проксируем заголовки
            for (const [key, value] of Object.entries(strapiRes.headers)) {
                reply.header(key, value as string);
            }

            // Проксируем тело ответа
            return strapiRes.body;
        } catch (error) {
            fastify.log.error(error);
            return reply.code(502).send({ error: 'Bad Gateway', details: error });
        }
    });
};
