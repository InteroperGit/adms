"use client"

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/libs/utils';

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

const PhotoIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
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
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

interface AboutCompanySectionProps {
    stats: string[];
    productionImages: string[];
    slideInterval?: number;
    className?: string;
}

const AboutCompanySection: React.FC<AboutCompanySectionProps> = ({
                                                                     stats,
                                                                     productionImages,
                                                                     slideInterval = 5000,
                                                                     className,
                                                                 }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productionImages.length);
    };

    const startTimer = () => {
        timerRef.current = setInterval(nextImage, slideInterval);
    };

    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        startTimer();
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [productionImages]);

    return (
        <section className={cn(
            "bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700",
            className
        )}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Левая колонка - текст и статистика */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">О компании</h2>

                    <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Мы — креативное рекламное агентство с полным циклом производства.
                    </p>

                    <ul className="space-y-3">
                        {stats.map((item, index) => (
                            <li
                                key={index}
                                className={cn(
                                    "relative pl-12 py-4",
                                    "bg-gray-50 dark:bg-gray-700",
                                    "text-gray-800 dark:text-white",
                                    "hover:bg-gray-100 dark:hover:bg-gray-600",
                                    "rounded-lg transition-colors duration-200"
                                )}
                            >
                <span className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2",
                    "w-6 h-6",
                    "bg-orange-500 dark:bg-orange-600",
                    "rounded-full flex items-center justify-center"
                )}>
                  <CheckIcon className="w-4 h-4 text-white" />
                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Правая колонка - слайдер */}
                <div className="w-full md:w-1/2">
                    <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {productionImages.map((image, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "absolute inset-0 transition-opacity duration-500",
                                    "flex items-center justify-center",
                                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                                )}
                            >
                                <img
                                    src={image}
                                    alt={`Производство ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="text-white text-center p-4">
                                        <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                                        <span className="text-sm">Фото производства</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Индикаторы слайдов */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {productionImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        resetTimer();
                                    }}
                                    className={cn(
                                        "w-3 h-3 rounded-full transition-colors",
                                        index === currentImageIndex
                                            ? "bg-orange-500"
                                            : "bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Показать фото ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCompanySection;