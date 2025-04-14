import Image from 'next/image'
import {ImageMeta} from "@/types/image";
import {useEffect, useRef, useState} from "react";

interface ArticleImageProps {
    image?: ImageMeta
    alt?: string
    priority?: boolean
    className?: string
}

const ArticleImage = ({
                          image,
                          alt,
                          priority = false,
                          className,
                      }: ArticleImageProps) => {
    const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const width = entry.contentRect.width;
                if (width < 600) {
                    setSize('small');
                } else if (width >= 600 && width < 900) {
                    setSize('medium');
                } else {
                    setSize('large');
                }
            });
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    if (!image || !image.formats) {
        return null
    }

    // Выбираем формат изображения в зависимости от размера
    const selectedFormat = image.formats[size]

    // Если формат для указанного размера существует, используем его, иначе fallback на исходный URL
    const imageUrl = selectedFormat?.url || ""

    return (
        <Image
            src={imageUrl}
            alt={alt || image.alt || 'Изображение'} // fallback на alt из cover если не передан
            width={selectedFormat?.width} // Используем ширину из формата, если есть
            height={selectedFormat?.height} // Используем высоту из формата, если есть
            className={className} // Передаем className без изменений
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
    )
}

export default ArticleImage
