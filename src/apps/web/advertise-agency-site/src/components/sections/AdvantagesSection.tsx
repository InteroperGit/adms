import React, {JSX} from 'react';
import {CompanyAdvantageItem} from "@/types/companyAdvantageItem";
import {cn} from "@/libs/utils";

interface AdvantagesSectionProps {
    advantages: CompanyAdvantageItem[];
    className?: string;
}

/**
 * AdvantagesSection — компонент для отображения списка преимуществ компании.
 * Он принимает массив объектов `advantages`, каждый из которых содержит заголовок и
 * описание преимущества, и отображает их в виде карточек.
 *
 * Основные особенности:
 * 1. Компонент принимает массив объектов `advantages` типа `CompanyAdvantageItem`,
 *    каждый элемент содержит `title` и `description`.
 * 2. Каждое преимущество отображается в отдельной карточке с фоновыми цветами,
 *    скруглениями и бордерами.
 * 3. Для каждой карточки используется эффект тени при наведении, улучшая визуальное
 *    восприятие с помощью `hover:shadow-md`.
 * 4. Секция имеет адаптивную сетку с тремя колонками на больших экранах и одной на
 *    мобильных.
 * 5. Возможность кастомизировать внешний вид через параметр `className`.
 *
 * Этот компонент полезен для отображения списка преимуществ компании на странице
 * в виде визуально выделенных карточек.
 */
const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({
                                                                 advantages,
                                                                 className
                                                             }): JSX.Element => {
    return (
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
            {advantages.map((item, index) => (
                <div
                    key={index}
                    className={cn("bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 ",
                        "dark:border-gray-700 hover:shadow-md transition-shadow duration-300")}
                >
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default AdvantagesSection;