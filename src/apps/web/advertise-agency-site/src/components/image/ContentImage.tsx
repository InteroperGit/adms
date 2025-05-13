"use client"

import Image from 'next/image'
import {ImageMeta} from "@/types/image";
import {JSX, useEffect, useRef, useState} from "react";

interface ContentImageProps {
    image?: ImageMeta
    priority?: boolean
    className?: string
    sizes?: string
}

// Хелпер: метод для обработки изменения размера контейнера
const getImageSizeByContainerWidth = (width: number): 'small' | 'medium' | 'large' | 'default' => {
    if (width < 750) {
        return 'medium';
    }
    if (width >= 750 && width < 1000) {
        return 'large';
    }
    return 'default';
};

/**
 * Компонент ContentImage предназначен для рендеринга изображений из Strapi (или аналогичной CMS),
 * с учётом адаптивных форматов (small, medium, large, default), предоставляемых сервером.
 *
 * Особенности:
 * - Использует ResizeObserver для определения ширины контейнера и выбора наиболее подходящего формата изображения.
 * - Поддерживает приоритетную загрузку (priority) и адаптивные размеры (sizes), как у компонента next/image.
 * - Оборачивает <Image> в <div>, чтобы можно было отслеживать размер через useRef.
 * - Поддерживает graceful fallback: если нужного формата нет, используется оригинальный URL изображения.
 * - Учитывает переданный className и alt-текст, если задан.
 *
 * Пример использования:
 * <ContentImage image={article.cover} priority className="rounded-lg" />
 *
 * Параметры:
 * - image (ImageMeta): объект изображения с разными форматами и метаданными.
 * - priority (boolean): если true — изображение будет загружено приоритетно (для выше вьюпорта).
 * - className (string): дополнительные CSS-классы для стилизации изображения.
 * - sizes (string): параметр для адаптивной загрузки изображений (как у <Image>).
 *
 * Поведение выбора формата:
 * - small: контейнер < 500px
 * - medium: 500px <= ширина < 750px
 * - large: 750px <= ширина < 1000px
 * - default: >= 1000px или отсутствует подходящий формат
 */
const ContentImage = ({
                          image,
                          priority = false,
                          className,
                          sizes
                      }: ContentImageProps): JSX.Element | null => {
    const [size, setSize] = useState<'small' | 'medium' | 'large' | 'default'>('medium');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries && entries[0];
            const width = entry.contentRect.width;
            const size = getImageSizeByContainerWidth(width);
            setSize(size);
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    if (!image || !image.formats) {
        return null;
    }

    // Выбираем формат изображения в зависимости от размера
    const selectedFormat = size === 'default' ? null : image.formats[size];

    // Если формат для указанного размера существует, используем его, иначе fallback на исходный URL
    const imageUrl = selectedFormat?.url || image.url || "";
    const width = selectedFormat?.width || image.width;
    const height = selectedFormat?.height || image.height;

    return (
        <div ref={containerRef}
             className="flex flex-1 justify-center items-center w-full h-full">
            <Image
                src={imageUrl}
                alt={image.alternativeText || 'Изображение'} // fallback на alt из cover если не передан
                width={width} // Используем ширину из формата, если есть
                height={height} // Используем высоту из формата, если есть
                className={className} // Передаем className без изменений
                priority={priority}
                sizes={sizes}
            />
        </div>
    )
}

export default ContentImage;
