"use client"

import React, { useState, useEffect } from "react"
import { ImageMeta } from "@/types/image"
import ContentImage from "./ContentImage"
import { X } from "lucide-react"
import {cn} from "@/libs/utils";

interface ContentImageViewerProps {
    image?: ImageMeta
    caption?: string
    className?: string
    sizes?: string
}

const ContentImageViewer: React.FC<ContentImageViewerProps> = ({
                                                                   image,
                                                                   caption,
                                                                   className,
                                                                   sizes,
                                                               }) => {
    const [open, setOpen] = useState(false)

    // Закрытие модалки при нажатии на клавишу Esc
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false)
            }
        }

        window.addEventListener("keydown", handleEsc)
        return () => {
            window.removeEventListener("keydown", handleEsc)
        }
    }, [])

    if (!image) {
        return null
    }

    return (
        <>
            {/* Клик по изображению открывает полноэкранный просмотр */}
            <div onClick={() => setOpen(true)} className="cursor-zoom-in">
                <ContentImage image={image} className={className} sizes={sizes} />
            </div>

            {/* Модалка с полноэкранным просмотром */}
            {open && (
                <div
                    className={cn("fixed inset-0 z-50 bg-black/90 backdrop-blur-sm",
                        "flex items-center justify-center",
                        "transition-opacity duration-300 ease-in-out")}
                    onClick={() => setOpen(false)} // Закрытие при клике вне изображения
                    aria-hidden="true"
                >
                    {/* Кнопка закрытия */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-red-400 focus:outline-none"
                        aria-label="Close image"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Главный контейнер с отступами и изображением */}
                    <div
                        className="w-[100vw] max-h-[100vh] flex flex-col mt-10"
                        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на само изображение
                    >
                        {/* Изображение в полноэкранном режиме с fill */}
                        <ContentImage
                            image={image}
                            className="w-full max-h-[85vh] object-contain mb-2" // Ограничим высоту изображения
                            sizes="80vw" // Указываем размеры для полноэкранного режима (80% от ширины экрана)
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
