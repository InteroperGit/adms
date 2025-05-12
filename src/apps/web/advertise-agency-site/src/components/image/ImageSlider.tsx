"use client"

import {ImageMeta} from "@/types/image";
import React, {JSX, useCallback, useEffect, useRef, useState} from "react";
import {cn} from "@/libs/utils";
import ContentImage from "@/components/image/ContentImage";

interface ImageSliderProps {
    images: ImageMeta[];
    interval?: number;
}

/**
 * ImageSlider — компонент для создания слайдера изображений с автоматической сменой картинок через заданный интервал.
 * Этот компонент позволяет отображать изображения, которые автоматически переключаются через определённое время, а также
 * поддерживает ручное переключение между изображениями с помощью кнопок внизу слайдера.
 *
 * Основные особенности:
 * 1. Слайдер отображает изображения в заданном интервале времени (по умолчанию 5000 мс).
 * 2. Возможность вручную переключать изображения, нажимая на индикаторы снизу слайдера.
 * 3. Используется `useRef` и `setInterval` для реализации автоматической смены изображений.
 * 4. Поддержка анимации плавного перехода изображений (изменение прозрачности).
 * 5. Индикаторы внизу слайдера показывают текущее изображение и позволяют перейти к любому изображению по клику.
 *
 * Этот компонент идеально подходит для создания галерей слайдов на веб-страницах,
 * где изображения меняются автоматически, но также можно вручную управлять слайдером.
 */
const ImageSlider = ({ images, interval = 5000 }: ImageSliderProps): JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images]);

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(nextImage, interval);
    }, [nextImage, interval]);

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
    }, [images, startTimer]);

    return (
        <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        "flex items-center justify-center",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                >
                    <ContentImage
                        image={image}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentIndex(index);
                            resetTimer();
                        }}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors",
                            index === currentIndex
                                ? "bg-orange-500"
                                : "bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Показать фото ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;