import { feedbackFormScheme } from "./schemes/feedbackFormScheme.js";
import { FormRegistry } from "./libs/types/formTypes.js";
import loggerFormHandler from "./handlers/LoggerFormHandler.js";

/**
 * Реестр форм и соответствующих обработчиков.
 *
 * Позволяет централизованно определять схему валидации и цепочку
 * обработчиков для каждой формы. Используется, например, в общем
 * контроллере обработки форм.
 *
 * @constant
 * @type {Readonly<FormRegistry>}
 *
 * @example
 * const form = formRegistry.contact;
 * const result = form.scheme.safeParse(request.body);
 * if (result.success) {
 *   for (const handler of form.handlers) {
 *     await handler(result.data);
 *   }
 * }
 */
export const formRegistry = {
    feedback: {
        scheme: feedbackFormScheme,
        handlers: [loggerFormHandler],
    },
} as const satisfies FormRegistry;
