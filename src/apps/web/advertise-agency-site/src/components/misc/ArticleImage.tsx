"use client"

import Image from 'next/image'
import {ImageMeta} from "@/types/image";
import {useEffect, useRef, useState} from "react";

interface ArticleImageProps {
    image?: ImageMeta
    priority?: boolean
    className?: string
    sizes?: string
}

const ArticleImage = ({
                          image,
                          priority = false,
                          className,
                          sizes
                      }: ArticleImageProps) => {
    const [size, setSize] = useState<'small' | 'medium' | 'large' | 'default'>('medium');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries && entries[0];

            const width = entry.contentRect.width;
            if (width < 500) {
                setSize('small');
            }
            else if (width >= 500 && width < 750) {
                setSize('medium');
            }
            else if (width >= 750 && width < 1000) {
                setSize('large');
            }
            else {
                setSize('default');
            }
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
        <div ref={containerRef}>
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

export default ArticleImage
