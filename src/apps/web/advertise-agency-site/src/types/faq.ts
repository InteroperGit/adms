/**
 * Элемент FAQ
 */
export interface FaqItem {
    /**
     * Вопрос
     */
    question: string;

    /**
     * Ответ
     */
    answer: string;
}

/**
 * FAQ
 */
export interface Faq {
    items: FaqItem[];
}