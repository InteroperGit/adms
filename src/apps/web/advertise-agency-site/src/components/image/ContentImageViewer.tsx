"use client"

import React, {useState} from "react"
import { ImageMeta } from "@/types/image"
import ContentImage from "./ContentImage"
import { X } from "lucide-react"
import { cn } from "@/libs/utils"

// Компонент кнопки закрытия
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-red-400 focus:outline-none"
        aria-label="Close image"
    >
        <X className="w-6 h-6" />
    </button>
)

// Компонент кнопки "предыдущее изображение"
const PrevButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={(e) => {
            e.stopPropagation(); // Останавливаем распространение клика
            onClick(); // Вызываем переданную функцию
        }}
        className={cn(
            "absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2",
            "rounded-full bg-black bg-opacity-50 hover:bg-orange-500 transition duration-300",
            "z-100"
        )}
        aria-label="Previous image"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    </button>
)

// Компонент кнопки "следующее изображение"
const NextButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={cn(
            "absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2",
            "rounded-full bg-black bg-opacity-50 hover:bg-orange-500 transition duration-300",
            "z-100"
        )}
        aria-label="Next image"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    </button>
)

interface ContentImageViewerProps {
    images: ImageMeta[] // Теперь мы принимаем массив изображений
    startIndex?: number,
    caption?: string
    className?: string
    sizes?: string,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * ContentImageViewer — компонент для отображения изображений в модальном окне с функциями переключения изображений.
 * Этот компонент принимает массив изображений и позволяет пользователю просматривать их в полноэкранном режиме с возможностью
 * переключения между изображениями с помощью кнопок "предыдущее" и "следующее". Также поддерживает закрытие модального окна
 * при клике на задний фон или с помощью кнопки закрытия.
 *
 * Основные особенности:
 * 1. Просмотр изображений в полноэкранном режиме с поддержкой переключения между ними.
 * 2. Поддержка кнопок "предыдущее изображение" и "следующее изображение" для удобной навигации.
 * 3. При отсутствии изображений компонент не рендерится.
 * 4. Возможность отображения подписи под изображением (если передан параметр `caption`).
 * 5. Используется состояние `currentIndex` для отслеживания текущего изображения и его изменения при переключении.
 * 6. Функции для управления переключением изображений (`nextImage`, `prevImage`) и закрытием модального окна.
 *
 * Этот компонент полезен для реализации галерей изображений с возможностью просмотра их в полноэкранном режиме на сайтах.
 */
const ContentImageViewer: React.FC<ContentImageViewerProps> = ({
                                                                   images,
                                                                   startIndex = 0,
                                                                   caption,
                                                                   open,
                                                                   setOpen,
                                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex) // Индекс текущего изображения
    const hasManyImages = images?.length > 0;

    if (images?.length === 0) {
        return null
    }

    // Функции для переключения изображений
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        )
    }

    return (
        <>
            {/* Модалка с полноэкранным просмотром */}
            {open && (
                <div
                    className={cn(
                        "fixed inset-0 z-50 bg-black/90 backdrop-blur-sm",
                        "flex items-center justify-center",
                        "transition-opacity duration-300 ease-in-out"
                    )}
                    onClick={() => setOpen(false)} // Закрытие при клике вне изображения
                    aria-hidden="true"
                >
                    {/* Кнопка закрытия */}
                    <CloseButton onClose={() => setOpen(false)} />

                    {/* Кнопка "предыдущее" */}
                    { hasManyImages && currentIndex > 0 && <PrevButton onClick={prevImage} /> }

                    {/* Кнопка "следующее" */}
                    { hasManyImages && currentIndex < images.length - 1 && <NextButton onClick={nextImage} /> }

                    {/* Контейнер для изображения с переключением */}
                    <div
                        className="relative w-[100vw] max-h-[100vh] flex flex-col mt-10"
                        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на само изображение
                    >
                        {/* Изображение в полноэкранном режиме с fill */}
                        <ContentImage
                            image={images[currentIndex]}
                            className="w-full max-h-[85vh] object-contain mb-2"
                            sizes="80vw"
                        />

                        {/* Описание изображения с центрированием */}
                        {caption && (
                            <div className="text-white text-sm m-4 text-center mt-2">
                                {caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ContentImageViewer
