import { z } from "zod";

/**
 * Минимальная длина строки для текстовых полей формы.
 *
 * Применяется к полям имени, телефона и сообщения.
 *
 * @constant
 * @type {number}
 * @default
 *
 * @example
 * if (input.length < MIN_STRING_LENGTH) {
 *   throw new Error("Too short");
 * }
 */
const MIN_STRING_LENGTH = 6;

/**
 * Схема валидации формы обратной связи, основанная на Zod.
 *
 * Все поля формы являются строками и требуют минимум 6 символов.
 *
 * @constant
 * @type {z.ZodObject}
 *
 * @example
 * const data = {
 *   name: "John Doe",
 *   phone: "+1234567890",
 *   message: "I'm interested in your services",
 * };
 *
 * const result = feedbackFormScheme.safeParse(data);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 */
export const feedbackFormScheme = z.object({
    id: z.string().min(MIN_STRING_LENGTH),
    name: z.string().min(MIN_STRING_LENGTH),
    phone: z.string().min(MIN_STRING_LENGTH),
    message: z.string().min(MIN_STRING_LENGTH),
});

