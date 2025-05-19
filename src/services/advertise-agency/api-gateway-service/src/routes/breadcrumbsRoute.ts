import { FastifyPluginAsync } from 'fastify';
import { request } from 'undici';
import {getBreadcrumbsApi} from "../libs/envUtils";

/**
 * Регистрирует маршрут Fastify для проксирования запросов к API хлебных крошек.
 *
 * Этот маршрут обрабатывает все запросы по пути `/breadcrumbs/*`, извлекает
 * оставшуюся часть пути, добавляет её к базовому адресу API хлебных крошек
 * (полученному из переменной окружения `BREADCRUMBS_API`), и перенаправляет
 * запрос к целевому API через `undici.request`.
 *
 * Все заголовки, статус и тело ответа проксируются обратно клиенту.
 *
 * @example
 * // Перенаправит GET http://localhost:3000/breadcrumbs/test/page
 * // на GET http://<BREADCRUMBS_API>/test/page
 * fastify.register(breadcrumbsRoute);
 *
 * @param {FastifyInstance} app - Экземпляр Fastify, в который регистрируется маршрут.
 */
export const breadcrumbsRoute: FastifyPluginAsync = async (app) => {
    app.get('/breadcrumbs/*', async (req, reply) => {
        const breadcrumbsBaseUrl = getBreadcrumbsApi();

        // Извлекаем подстроку после /breadcrumbs
        const breadcrumbsPath = req.url.replace(/^\/breadcrumbs/, '');

        // Формируем полный URL к Strapi
        const breadcrumbsUrl = `${breadcrumbsBaseUrl}${breadcrumbsPath}`;

        try {
            const breadcrumbsRes = await request(breadcrumbsUrl, {
                method: req.method,
                headers: req.headers,
                body: req.raw,
            });

            // Проксируем статус
            reply.status(breadcrumbsRes.statusCode);

            // Проксируем заголовки
            for (const [key, value] of Object.entries(breadcrumbsRes.headers)) {
                reply.header(key, value as string);
            }

            // Проксируем тело ответа
            return breadcrumbsRes.body;
        } catch (error) {
            app.log.error(error);
            return reply.code(502).send({ error: 'Bad Gateway', details: error });
        }
    });
};
