import React from "react";
import { cn } from "@/libs/utils";
import {Faq} from "@/types/faq";

/**
 * Интерфейс для пропсов компонента FaqSection.
 * Этот интерфейс описывает типы данных, которые принимает компонент FaqSection для отображения секции "Частые вопросы" (FAQ).
 *
 * @param {Faq} faq - Объект, содержащий список вопросов и ответов (FAQ). Включает массив `items`, в котором каждый элемент представляет собой объект с вопросом и ответом.
 * @param {string} [className] - Необязательный параметр. Дополнительный CSS класс для кастомизации внешнего вида компонента. Если не передан, применяется стандартный стиль.
 */
interface FaqSectionProps {
    faq: Faq;
    className?: string;
}

/**
 * Компонент для отображения секции "Частые вопросы" (FAQ).
 * Этот компонент принимает объект `faq`, который содержит список вопросов и ответов, и отображает их на странице.
 * Каждый элемент списка отображается в виде блока с вопросом (в заголовке) и ответом (в параграфе).
 * Компонент также поддерживает дополнительный CSS класс `className`, который может быть передан для кастомизации внешнего вида секции.
 *
 * @param {Object} faq - Объект с данными FAQ, содержащий массив вопросов и ответов.
 * @param {string} [className] - Дополнительный CSS класс для кастомизации внешнего вида компонента.
 *
 * @returns {JSX.Element} - Разметка с вопросами и ответами в виде списка.
 */
export default function FaqSection({ faq, className }: FaqSectionProps) {
    return (
        <div className={cn(`${className}`)}>
            <h2 className={cn("text-2xl font-bold mb-6 dark:text-gray-200")}>Частые вопросы</h2>
            <div className={cn("space-y-6")}>
                {faq.items.map((item, i) => (
                    <div key={i} className={cn("border-b dark:border-gray-700 pb-4")}>
                        <h3 className={cn("font-bold mb-2 dark:text-gray-200")}>{item.question}</h3>
                        <p className={cn("text-gray-600 dark:text-gray-400")}>{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
