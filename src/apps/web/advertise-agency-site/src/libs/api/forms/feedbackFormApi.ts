import {FeedbackFormContent} from "@/types/forms/feedbackForm";
import {FormSendResult} from "@/types/forms/formSendResult";

const FORM_DATA_URL = process.env.NEXT_PUBLIC_FORM_DATA_URL;

if (!FORM_DATA_URL) {
    throw new Error("Failed to get ford-data service url");
}

/**
 * Отправляет данные формы обратной связи на внешний сервис.
 *
 * Использует URL из переменной окружения `NEXT_PUBLIC_FORM_DATA_URL`.
 * В случае ошибки возвращает объект с ошибкой и статусом "error".
 *
 * @param {FeedbackFormContent} data - Объект с данными формы.
 * @returns {Promise<FormSendResult>} Результат отправки формы.
 *
 * @throws {Error} Если переменная окружения FORM_DATA_URL не определена.
 *
 * @example
 * const feedback: FeedbackFormContent = {
 *   id: "123",
 *   name: "Jane Doe",
 *   phone: "+123456789",
 *   message: "Call me back please"
 * };
 *
 * const result = await sendFeedbackData(feedback);
 * if (result.status === "success") {
 *   console.log("Feedback sent successfully!");
 * } else {
 *   console.error("Feedback submission failed:", result.message);
 * }
 */
export const sendFeedbackFormData = async (
    data: FeedbackFormContent
): Promise<FormSendResult> => {
    try {
        const url = `${FORM_DATA_URL}/feedback`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Failed to send feedback form data");
            return {
                message: "Failed to send feedback form data",
                status: "error",
            };
        }

        return {
            message: "Successfully send feedback form data",
            status: "success",
        };
    } catch (error) {
        console.error(error);
        return {
            message: "Failed to send feedback form data",
            status: "error",
        };
    }
};
