import { z } from "zod";

/**
 * Тип функции-обработчика данных формы.
 *
 * Принимает валидированные данные формы типа T и возвращает Promise<void>.
 *
 * @template T
 * @callback HandlerFn
 * @param {T} body - Валидированные данные формы.
 * @returns {Promise<void>} Асинхронный результат без значения.
 *
 * @example
 * const handler: HandlerFn<{ name: string }> = async (data) => {
 *   console.log(data.name);
 * };
 */
export type HandlerFn<T extends z.ZodTypeAny> = (body: z.infer<T>) => Promise<void>;

/**
 * Элемент реестра формы с её схемой и обработчиками.
 *
 * @template T - Тип Zod-схемы формы.
 * @typedef {object} FormRegistryItem
 * @property {T} scheme - Схема валидации формы (Zod-схема).
 * @property {HandlerFn<z.infer<T>>[]} handlers - Список обработчиков.
 *
 * @example
 * const item: FormRegistryItem<typeof someSchema> = {
 *   scheme: someSchema,
 *   handlers: [async (data) => { console.log(data); }],
 * };
 */
export type FormRegistryItem<T extends z.ZodTypeAny> = {
    scheme: T;
    handlers: HandlerFn<z.infer<T>>[];
};

/**
 * Список допустимых идентификаторов форм.
 *
 * Используется для строгой типизации ключей реестра форм.
 *
 * @constant
 * @type {readonly string[]}
 *
 * @example
 * if (formIdList.includes('feedback')) {
 *   // valid form id
 * }
 */
export const formIdList = ['feedback'] as const;

/**
 * Тип идентификатора формы — строковый литерал из formIdList.
 *
 * @typedef {typeof formIdList[number]} FormId
 *
 * @example
 * const formId: FormId = 'contact';
 */
export type FormId = typeof formIdList[number];

/**
 * Тип реестра форм с ключами из FormId и значениями FormRegistryItem.
 *
 * @typedef {object} FormRegistry
 * @property {FormRegistryItem<z.ZodTypeAny>} [key: FormId]
 *
 * @example
 * const registry: FormRegistry = {
 *   contact: {
 *     scheme: someSchema,
 *     handlers: [handler1, handler2],
 *   },
 * };
 */
export type FormRegistry = {
    [K in FormId]: FormRegistryItem<z.ZodTypeAny>;
};

/**
 * Тип ответа после обработки данных формы.
 *
 * @typedef {object} FormDataHandleResponse
 * @property {string} message - Текст сообщения об успехе или ошибке.
 * @property {"success" | "error"} status - Статус обработки.
 *
 * @example
 * const response: FormDataHandleResponse = {
 *   message: "Form submitted successfully",
 *   status: "success",
 * };
 */
export type FormDataHandleResponse = {
    message: string;
    status: "success" | "error";
};
