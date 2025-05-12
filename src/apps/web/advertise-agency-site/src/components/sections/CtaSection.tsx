// components/sections/CtaSection.tsx
"use client"

import Link from "next/link";
import { cn } from "@/libs/utils";
import React, {JSX} from "react";

interface CtaSectionProps {
    /**
     * Основной заголовок секции
     * @default "Хотите такой же результат?"
     */
    title?: string;

    /**
     * Описание под заголовком
     * @default "Оставьте заявку и мы обсудим ваш проект"
     */
    description?: string;

    /**
     * Текст кнопки призыва к действию
     * @default "Обсудить проект"
     */
    buttonText?: string;

    /**
     * Ссылка для кнопки
     * @default "/contact"
     */
    buttonHref?: string;

    /**
     * Дополнительные классы для контейнера секции
     */
    className?: string;

    /**
     * Дополнительные классы для заголовка
     */
    titleClassName?: string;

    /**
     * Дополнительные классы для описания
     */
    descriptionClassName?: string;

    /**
     * Дополнительные классы для кнопки
     */
    buttonClassName?: string;
}

/**
 * CtaSection - Секция с призывом к действию (Call To Action).
 *
 * Используется для побуждения пользователей к ключевому действию:
 * - Заказ услуги
 * - Оформление заявки
 * - Переход в другой раздел
 *
 * Особенности:
 * - Поддержка светлой/темной темы
 * - Адаптивный дизайн (mobile-first)
 * - Кастомизация всех текстов и стилей
 * - Встроенная анимация кнопки
 * - Готовый компонент Link из Next.js
 *
 * @example
 * // Базовое использование
 * <CtaSection />
 *
 * @example
 * // Полная кастомизация
 * <CtaSection
 *   title="Готовы начать?"
 *   description="Наши специалисты ждут вашего обращения"
 *   buttonText="Начать сотрудничество"
 *   buttonHref="/order"
 *   className="my-12"
 *   buttonClassName="hover:scale-105 transform transition-all"
 * />
 */
const CtaSection: React.FC<CtaSectionProps> = ({
                               title = "Хотите такой же результат?",
                               description = "Оставьте заявку и мы обсудим ваш проект",
                               buttonText = "Обсудить проект",
                               buttonHref = "/contact",
                               className,
                               titleClassName,
                               descriptionClassName,
                               buttonClassName,
                           }: CtaSectionProps): JSX.Element => {
    return (
        <section className={cn(
            "bg-orange-600 dark:bg-orange-800 text-white py-16 px-6",
            className
        )}>
            <div className={cn("container mx-auto text-center")}>
                <h2 className={cn(
                    "text-2xl md:text-3xl font-bold mb-6",
                    titleClassName
                )}>
                    {title}
                </h2>

                <p className={cn(
                    "text-xl mb-8 max-w-2xl mx-auto",
                    descriptionClassName
                )}>
                    {description}
                </p>

                <Link
                    href={buttonHref}
                    className={cn(
                        "inline-block bg-white text-orange-600 dark:text-orange-800",
                        "px-8 py-3 rounded-full font-bold hover:bg-gray-100",
                        "transition-colors duration-200",
                        buttonClassName
                    )}
                >
                    {buttonText}
                </Link>
            </div>
        </section>
    );
};

export default CtaSection;