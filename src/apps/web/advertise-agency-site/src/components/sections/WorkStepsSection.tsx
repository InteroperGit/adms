"use client";

import React, {JSX, useEffect, useState} from "react";
import { cn } from "@/libs/utils";
import {CompanyWorkStep} from "@/types/companyWorkStep";

interface WorkSectionProps {
    workSteps: CompanyWorkStep[];
    className?: string;
}

/**
 * WorkStepsSection — компонент, отображающий последовательность шагов
 * в процессе работы компании с динамическим выделением шагов. Каждый
 * шаг включает номер, заголовок и описание, а также выделяется с
 * анимацией пульсации каждые 5 секунд.
 *
 * @param {Object} props — свойства компонента.
 * @param {Array<Object>} props.workSteps — массив шагов, где каждый шаг
 * содержит следующие поля:
 * @param {number} props.workSteps.stepNumber — номер шага.
 * @param {string} props.workSteps.title — заголовок шага.
 * @param {string} props.workSteps.description — описание шага.
 * @param {string} [props.className] — дополнительные CSS-классы для стилизации компонента.
 *
 * @returns {JSX.Element} Рендерит компонент с анимацией выделения этапов работы.
 *
 * Пример использования:
 *
 * <WorkStepsSection
 *   workSteps={[
 *     { stepNumber: 1, title: 'Шаг 1', description: 'Описание первого шага' },
 *     { stepNumber: 2, title: 'Шаг 2', description: 'Описание второго шага' },
 *     { stepNumber: 3, title: 'Шаг 3', description: 'Описание третьего шага' },
 *     { stepNumber: 4, title: 'Шаг 4', description: 'Описание четвертого шага' },
 *     { stepNumber: 5, title: 'Шаг 5', description: 'Описание пятого шага' }
 *   ]}
 *   className="custom-class"
 * />
 */
const WorkStepsSection: React.FC<WorkSectionProps> = ({ workSteps, className }: WorkSectionProps): JSX.Element => {
    // Состояние для текущего выделенного шага
    const [highlightedStep, setHighlightedStep] = useState<number | null>(null);

    useEffect(() => {
        // Функция для анимации выделения
        const interval = setInterval(() => {
            setHighlightedStep((prevStep) => {
                // Проверка, чтобы гарантировать, что prevStep не null
                return prevStep === null ? 1 : prevStep === 5 ? 1 : prevStep + 1;
            });
        }, 5000); // Каждые 5 секунд меняем выделение

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    return (
        <div className={cn(`${className}`)}>
            <h2 className={cn("text-2xl font-bold mb-6")}>Как мы работаем</h2>
            <div className={cn("grid grid-cols-1 md:grid-cols-5 gap-4")}>
                {workSteps.map((step, i) => (
                    <div key={i} className={cn("flex flex-col items-center text-center")}>
                        {/* Кружок с номером */}
                        <div
                            className={cn(
                                "w-12 h-12 text-white rounded-full flex items-center justify-center mb-2",
                                {
                                    "bg-orange-400 dark:bg-orange-700": highlightedStep !== i + 1,
                                    "bg-orange-600 dark:bg-orange-900": highlightedStep === i + 1, // Выделение фоном
                                    "animate-pulse": highlightedStep === i + 1 // Анимация пульсации
                                }
                            )}
                        >
                            {step.stepNumber}
                        </div>

                        {/* Заголовок и описание */}
                        <h3 className={cn("font-bold mb-1 dark:text-gray-200")}>{step.title}</h3>
                        <p className={cn("text-sm text-gray-600 dark:text-gray-400")}>{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkStepsSection;