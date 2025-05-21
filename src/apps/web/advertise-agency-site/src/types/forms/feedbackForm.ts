import {BaseFormContent} from "@/types/forms/formBase";

/**
 * Интерфейс описывает содержимое формы обратной связи.
 *
 * Используется для представления структурированных данных, полученных от
 * пользователя через форму.
 *
 * @property {string} id - Уникальный идентификатор записи.
 * @property {string} name - Имя пользователя, заполнившего форму.
 * @property {string} phone - Телефонный номер пользователя.
 * @property {string} message - Сообщение пользователя.
 *
 * @example
 * const feedback: FeedbackFormContent = {
 *   id: "a1b2c3",
 *   name: "John Doe",
 *   phone: "+1234567890",
 *   message: "I'd like to learn more about your services.",
 * };
 */
export interface FeedbackFormContent extends BaseFormContent {
    name: string;
    phone: string;
    message: string;
}
