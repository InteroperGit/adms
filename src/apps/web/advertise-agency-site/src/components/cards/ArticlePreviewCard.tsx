// components/cards/ArticleCard.tsx
"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {ArticlePreview} from "@/types/article";

interface ArticlePreviewCardProps {
    /**
     * Данные статьи для отображения
     */
    article: ArticlePreview

    /**
     * Дополнительные классы для кастомизации стилей карточки
     */
    className?: string

    /**
     * Базовый путь для ссылки "Читать далее"
     * @default "/articles"
     */
    basePath?: string

    /**
     * Включить hover-эффекты
     * @default true
     */
    enableHoverEffects?: boolean

    /**
     * Приоритет загрузки изображения (для Next.js Image)
     * @default false
     */
    priority?: boolean
}

/**
 * ArticleCard - Карточка для отображения превью статьи.
 *
 * Компонент отображает:
 * - Изображение статьи с hover-эффектом
 * - Категорию и мета-информацию (дата, время чтения)
 * - Заголовок и краткое описание
 * - Ссылку "Читать далее"
 *
 * Особенности:
 * - Оптимизированная загрузка изображений через Next.js Image
 * - Поддержка темной темы
 * - Адаптивный дизайн
 * - Ограничение текста (line-clamp)
 * - Настраиваемые hover-эффекты
 *
 * @example
 * // Базовое использование
 * <ArticleCard article={articleData} />
 *
 * @example
 * // С кастомизацией
 * <ArticleCard
 *   article={article}
 *   className="border-2 border-primary"
 *   basePath="/blog"
 *   enableHoverEffects={false}
 *   priority={true}
 * />
 */
export const ArticlePreviewCard = ({
                                article,
                                className,
                                basePath = "/articles",
                                enableHoverEffects = true,
                                priority = false,
                            }: ArticlePreviewCardProps) => {
    return (
        <div
            className={cn(
                "group rounded-lg shadow-md overflow-hidden",
                "bg-card text-card-foreground",
                "transition-all duration-300 h-full flex flex-col",
                enableHoverEffects && "hover:shadow-lg",
                className
            )}
        >
            {/* Область изображения */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-500",
                        enableHoverEffects && "group-hover:scale-105"
                    )}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Контент карточки */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Мета-информация */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-primary font-medium">
                        {article.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {article.date} · {article.readTime}
                     </span>
                </div>

                {/* Заголовок и описание */}
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                </p>

                {/* Кнопка "Читать далее" */}
                <Button
                    asChild
                    variant="link"
                    className="px-0 self-start mt-auto"
                >
                    <Link href={`${basePath}/${article.id}`}>
                        Читать далее
                    </Link>
                </Button>
            </div>
        </div>
    )
}