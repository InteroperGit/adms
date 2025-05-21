import { FastifyPluginAsync } from 'fastify';

/**
 * Плагин Fastify, регистрирующий маршрут для проверки работоспособности
 * API Gateway или любого другого сервиса, использующего этот маршрут.
 *
 * Маршрут: GET /health
 * Возвращает простой JSON-ответ с полем `status: "ok"`.
 *
 * Это используется для:
 * - автоматического мониторинга состояния сервиса
 * - проверки доступности при деплое и в CI/CD пайплайнах
 * - настройки проверок на балансировщиках и оркестраторах
 *
 * Пример:
 * Запрос:  GET /health
 * Ответ:   { "status": "ok" }
 *
 * @type {FastifyPluginAsync}
 */
const healthRoute: FastifyPluginAsync = async (app) => {
    app.get("/health", async () => {
        return { status: "ok" }
    });
}

export default healthRoute;