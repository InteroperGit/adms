import { z } from "zod";

/**
 * Обработчик формы, логирующий данные запроса в консоль.
 *
 * Поддерживает любые данные, соответствующие переданной Zod-схеме.
 * Используется, например, для отладки или записи заявок в лог.
 *
 * @template T
 * @param {z.infer<T>} body - Валидированные данные формы.
 * @returns {Promise<void>} Ничего не возвращает.
 *
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   phone: z.string(),
 * });
 * const data = { name: "Alice", phone: "+123456789" };
 * await loggerFormHandler<typeof schema>(data);
 */
const loggerFormHandler = async <T extends z.ZodTypeAny>(
    body: z.infer<T>
): Promise<void> => {
    const resultString = "id" in body
        ? `Form handler [${body.id}]. Body: ${JSON.stringify(body, null, 2)}`
        : `Form handler. Body: ${JSON.stringify(body, null, 2)}`

    console.log(resultString);
};

export default loggerFormHandler;
