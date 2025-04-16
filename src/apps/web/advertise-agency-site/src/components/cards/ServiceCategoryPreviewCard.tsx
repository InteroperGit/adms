import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/libs/utils";
import { ServiceCategory } from "@/types/service";
import ContentImage from "@/components/misc/ContentImage";

interface ServiceCategoryPreviewCardProps {
    /**
     * Данные категории услуг для отображения
     */
    category: ServiceCategory;

    /**
     * Дополнительные классы для кастомизации стилей карточки
     */
    className?: string;

    /**
     * Базовый путь для ссылки "Подробнее"
     * @default "/services"
     */
    basePath?: string;

    /**
     * Включить hover-эффекты
     * @default true
     */
    enableHoverEffects?: boolean;

    /**
     * Приоритет загрузки изображения (для Next.js Image)
     * @default false
     */
    priority?: boolean;
}

/**
 * ServicePreviewCard - Карточка превью категории услуг.
 *
 * Компонент отображает:
 * - Изображение категории
 * - Название и описание
 * - Кнопку "Подробнее"
 */
export const ServiceCategoryPreviewCard = ({
                                               category,
                                               className,
                                               basePath = "/services",
                                               enableHoverEffects = true,
                                               priority = false,
                                           }: ServiceCategoryPreviewCardProps) => {
    const categoryUrl = category.href ?? `${basePath}/${category.id}`;

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
            {/* Область изображения или заглушки */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Link href={categoryUrl} passHref legacyBehavior>
                    <a className="block h-full w-full">
                        {category.cover ? (
                            <ContentImage
                                image={category.cover}
                                priority={priority}
                                className={cn(
                                    "object-cover h-full w-full transition-transform duration-500 cursor-pointer",
                                    enableHoverEffects && "group-hover:scale-105"
                                )}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                Без изображения
                            </div>
                        )}
                    </a>
                </Link>
            </div>

            {/* Контент карточки */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {category.title || category.name}
                </h3>
                {category.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-[6] flex-1">
                        {category.description}
                    </p>
                )}

                {/* Кнопка "Подробнее" */}
                <Button
                    asChild
                    variant="link"
                    className="px-0 self-start mt-auto"
                >
                    <Link href={categoryUrl}>
                        Подробнее
                    </Link>
                </Button>
            </div>
        </div>
    );
};

