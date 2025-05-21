import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { formRegistry } from "../formRegistry";
import {
    FormId,
    formIdList,
    FormDataHandleResponse,
} from "../libs/types/formTypes";

/**
 * Асинхронный плагин Fastify для обработки POST-запросов на формы.
 *
 * Позволяет принимать данные различных форм, валидировать их по схеме из
 * реестра, и передавать валидированные данные в цепочку обработчиков.
 *
 * @param {FastifyInstance} fastify - Экземпляр Fastify.
 * @returns {Promise<void>}
 *
 * @example
 * fastify.register(formRoute);
 */
const formRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.post("/forms/:formId", async (req, reply) => {
        const { formId } = req.params as { formId: string };

        // Проверяем, что formId допустим
        if (!formIdList.includes(formId as FormId)) {
            reply.code(404).send({ error: "Unknown form" });
            return;
        }

        // Получаем схему и обработчики из реестра по formId
        const form = formRegistry[formId as keyof typeof formRegistry];

        if (!form) {
            return reply.status(404).send({ error: "Unknown form" });
        }

        // Валидируем тело запроса по схеме
        const result = form.scheme.safeParse(req.body);

        if (!result.success) {
            req.log.error(result.error);

            return reply.status(400).send({
                message: "Failed to handle form data",
                status: "error",
            } as FormDataHandleResponse);
        }

        try {
            // Выполняем все обработчики последовательно
            for (const handler of form.handlers) {
                await handler(result.data);
            }

            return reply.send({
                message: "Form data was successfully handled",
                status: "success",
            } as FormDataHandleResponse);
        } catch (error) {
            req.log.error(error);
            return reply.status(500).send({
                message: "Failed to handle form data",
                status: "error",
            } as FormDataHandleResponse);
        }
    });
};

export default formRoute;
