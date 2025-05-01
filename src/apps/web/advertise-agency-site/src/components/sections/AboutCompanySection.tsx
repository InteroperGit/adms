"use client"

import React, {useState, useEffect, useRef, useCallback} from 'react';
import { cn } from '@/libs/utils';
import {AboutCompany} from "@/types/aboutCompany";
import ContentImage from "@/components/image/ContentImage";
import {ImageMeta} from "@/types/image";
import ImageSlider from "@/components/image/ImageSlider";

// Константы с SVG-иконками
const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
        />
    </svg>
);

interface AboutCompanySectionProps {
    aboutCompany: AboutCompany;
    slideInterval?: number;
    className?: string;
}

const CompanyHighlights = ({ highlights }: { highlights: string[] }) => (
    <ul className="space-y-3">
        {highlights.map((item, index) => (
            <li
                key={index}
                className={cn(
                    "relative pl-12 py-4",
                    "bg-gray-100 dark:bg-gray-700",
                    "text-gray-800 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-600",
                    "rounded-lg transition-colors duration-200"
                )}
            >
                <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6",
                    "bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center")}>
                    <CheckIcon className="w-4 h-4 text-white" />
                </span>
                {item}
            </li>
        ))}
    </ul>
);

/**
 * Секция "О компании", отображающая описание, ключевые преимущества и слайдер с фотографиями.
 *
 * Props:
 * - `aboutCompany`: объект с данными о компании, включая описание, список особенностей и изображения.
 * - `slideInterval`: интервал переключения слайдов (по умолчанию 5000 мс).
 * - `className`: дополнительный CSS-класс для стилизации секции.
 *
 * Компонент реализует автоматический слайдер с ручным управлением и индикаторами,
 * а также список ключевых преимуществ компании.
 */
const AboutCompanySection: React.FC<AboutCompanySectionProps> = ({
                                                                     aboutCompany,
                                                                     slideInterval = 5000,
                                                                     className,
                                                                 }) => {
    return (
        <section className={cn(
            "bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700",
            className
        )}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Левая колонка - текст и статистика */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{aboutCompany.title}</h2>

                    <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {aboutCompany.description}
                    </p>

                    <CompanyHighlights highlights={aboutCompany.highlights} />
                </div>

                {/* Правая колонка - слайдер */}
                <div className="w-full md:w-1/2">
                    <ImageSlider images={aboutCompany.images} interval={slideInterval} />
                </div>
            </div>
        </section>
    );
};

export default AboutCompanySection;