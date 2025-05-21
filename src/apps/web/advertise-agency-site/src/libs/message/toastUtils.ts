import { toast } from "sonner";

/**
 * Отправляет toast-сообщение определённого типа.
 *
 * Поддерживаются типы: "success" и "error". Используется библиотека `sonner`
 * для отображения уведомлений. Если сообщение не задано — выбрасывается ошибка.
 *
 * @param {string} message - Текст сообщения для отображения.
 * @param {"success" | "error"} type - Тип уведомления.
 *
 * @throws {Error} Если сообщение не задано.
 *
 * @example
 * sendToastMessage("Form submitted", "success");
 * sendToastMessage("Submission failed", "error");
 */
export const sendToastMessage = (
    message: string,
    type: "success" | "error"
) => {
    if (!message) {
        throw new Error("Failed to send toast message");
    }

    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    }
};
