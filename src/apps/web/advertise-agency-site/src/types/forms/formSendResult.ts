/**
 * Интерфейс результата отправки формы.
 *
 * Используется для обозначения итогового статуса обработки формы и
 * сопутствующего сообщения.
 *
 * @property {string} message - Текстовое сообщение для пользователя или лога.
 * @property {"success" | "error"} status - Статус обработки формы.
 *
 * @example
 * const result: FormSendResult = {
 *   message: "Form submitted successfully",
 *   status: "success"
 * };
 */
export interface FormSendResult {
    message: string;
    status: "success" | "error";
}
