'use client'

import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem as BreadcrumbItemUi,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from "lucide-react"
import { cn } from "@/libs/utils"
import { usePathname } from 'next/navigation'
import {JSX, useEffect, useState} from "react"
import { Skeleton } from '@/components/ui/skeleton'
import { useBreadcrumbs } from '@/libs/providers/BreadcrumbsProvider'
import {BreadcrumbItem} from "@/types/breadcrumbs";

const TRANSITION_DURATION = 500;
const SKELETON_HEIGHT = 24
const INITIAL_SKELETON_COUNT = 2

function renderBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    return breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center opacity-100">
            <BreadcrumbItemUi className="text-sm">
                {!item.isCurrent && item.href ? (
                    <BreadcrumbLink
                        href={item.href}
                        className={cn(
                            "font-medium transition-colors underline-offset-4",
                            "text-gray-600 hover:text-primary hover:underline",
                            "dark:text-gray-300 dark:hover:text-white"
                        )}
                    >
                        {item.title}
                    </BreadcrumbLink>
                ) : (
                    <BreadcrumbPage className="font-semibold text-gray-800 dark:text-white">
                        {item.title}
                    </BreadcrumbPage>
                )}
            </BreadcrumbItemUi>
            {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="mx-2 text-gray-400 dark:text-gray-500">
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
            )}
        </div>
    ))
}

function renderSkeletons(count: number) {
    return Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center">
            <BreadcrumbItemUi>
                <Skeleton className="h-4 w-20 rounded" />
            </BreadcrumbItemUi>
            {index < count - 1 && (
                <BreadcrumbSeparator className="mx-2 text-gray-400 dark:text-gray-500">
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
            )}
        </div>
    ))
}

/**
 * Breadcrumbs — компонент для отображения хлебных крошек на странице с поддержкой
 * анимаций и скелетонов. Он отображает путь навигации, состоящий из нескольких
 * ссылок, позволяющих пользователю увидеть и перейти по иерархии страниц. Также
 * включает скелетон для загрузки, который отображается до того, как хлебные крошки
 * будут загружены.
 *
 * Основные особенности:
 * 1. Хлебные крошки генерируются на основе данных из контекста, получаемых через
 *    хук `useBreadcrumbs`, и отображаются как список ссылок.
 * 2. При изменении пути или загрузке данных отображается анимация (плавный переход)
 *    с помощью состояния `isTransitioning` и задержки через `setTimeout`.
 * 3. Поддержка адаптивного дизайна, стилизация с использованием Tailwind CSS.
 * 4. Если данные не загружены, отображается скелетон, имитирующий загрузку хлебных
 *    крошек.
 * 5. Предусмотрено поведение для главной страницы, на которой хлебные крошки не
 *    отображаются.
 * 6. Использование иконки разделителя `ChevronRight` между хлебными крошками.
 *
 * Компонент полезен для улучшения навигации по сайту, позволяя пользователям
 * легко ориентироваться в структуре страниц и возвращаться к предыдущим уровням.
 */
const Breadcrumbs = (): JSX.Element | null => {
    const pathname = usePathname()
    const { breadcrumbs, loading, error } = useBreadcrumbs()
    const [isTransitioning, setIsTransitioning] = useState(true)
    const isMainPage = pathname === "/"

    useEffect(() => {
        // При изменении пути включаем анимацию перехода
        setIsTransitioning(true)

        // Таймер для плавного скрытия скелетона
        const timer = setTimeout(() => {
            setIsTransitioning(false)
        }, TRANSITION_DURATION) // Длительность анимации

        return () => clearTimeout(timer)
    }, [pathname])

    if (error || isMainPage) {
        return null
    }

    // Показываем скелетон только при загрузке или переходе между страницами
    const showSkeleton = loading || isTransitioning
    const showContent = !showSkeleton && breadcrumbs.length > 0

    return (
        <div className="mx-6 my-8">
            <hr className="mb-4 border-t border-gray-200 dark:border-gray-700" />
            <Breadcrumb className="ml-6">
                <BreadcrumbList
                    className="flex items-center gap-2"
                    style={{ minHeight: `${SKELETON_HEIGHT}px` }}
                >
                    {showSkeleton
                        ? renderSkeletons(INITIAL_SKELETON_COUNT)
                        : showContent && renderBreadcrumbs(breadcrumbs)
                    }
                </BreadcrumbList>
            </Breadcrumb>
            <hr className="mt-4 border-t border-gray-200 dark:border-gray-700" />
        </div>
    )
}

export default Breadcrumbs;