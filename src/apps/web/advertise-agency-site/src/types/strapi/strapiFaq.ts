/**
 * Элемент FAQ
 */
export interface StrapiFaqItem {
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
export interface StrapiFaq {
    items: StrapiFaqItem[];
}