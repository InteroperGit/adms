import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import { request } from "undici";
import {getStrapiApi} from "../libs/envUtils";

const targetMap: Record<string, string> = {
    strapi: getStrapiApi(),
};

/**
 * Плагин Fastify, регистрирующий маршрут для проксирования запросов
 * на внутренние сервисы, такие как CMS или сервер изображений.
 *
 * Маршрут имеет формат: GET /api/proxy/:target/*
 * Значение `target` используется для выбора адреса из `targetMap`,
 * а оставшаяся часть пути добавляется к адресу целевого сервиса.
 *
 * Это удобно для:
 * - централизации API-запросов через один шлюз
 * - обхода CORS-проблем на фронтенде
 * - маршрутизации к разным сервисам по имени
 *
 * Допустимые значения `target` задаются в `targetMap`.
 *
 * Пример:
 * Если targetMap = { strapi: 'http://localhost:1337' }
 *
 * Запрос:   GET /api/proxy/strapi/api/articles
 * Прокси:   GET http://localhost:1337/api/articles
 *
 * Если `target` отсутствует в `targetMap`, возвращается 404.
 *
 * @type {FastifyPluginAsync}
 */
export const proxyRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/api/proxy/:target/*", async (req, reply) => {
       const { target } = req.params as { target: string };
       const subPath = req.url.split(`/api/proxy/${target}`)[1];

       const upstream = targetMap[target];

       if (!upstream) {
           return reply.code(404).send({ error: "Unknown target" });
       }

       const proxyRes = await request(`${upstream}${subPath}`, {
           method: req.method,
           headers: req.headers,
           body: req.raw
       });

       reply.status(proxyRes.statusCode);

       for (const [key, value] of Object.entries(proxyRes.headers)) {
           reply.header(key, value as string);
       }

       return proxyRes.body;
    });
}