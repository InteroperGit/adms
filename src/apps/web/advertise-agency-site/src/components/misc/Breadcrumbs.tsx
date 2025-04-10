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
import { useEffect, useState } from "react"
import { BreadcrumbItem } from "@/types/breadcrumbs"
import { Skeleton } from '@/components/ui/skeleton'

const INITIAL_SKELETON_COUNT = 2
const TRANSITION_DURATION = 300 // 1 секунда для перехода
const SKELETON_HEIGHT = 24 // фиксированная высота для скелетонов

export function Breadcrumbs() {
    const pathname = usePathname()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
    const [isPageChanging, setIsPageChanging] = useState<boolean>(false)
    const [isSkeletonVisible, setIsSkeletonVisible] = useState<boolean>(true)
    const isMainPage = pathname.length === 1 && pathname === "/"

    useEffect(() => {
        setIsPageChanging(true)
        setIsSkeletonVisible(true)

        const fetchBreadcrumbs = async () => {
            try {
                const res = await fetch(`/api/breadcrumbs?path=${encodeURIComponent(pathname)}`)
                if (!res.ok) {
                    throw new Error("Network response failed")
                }
                const data = await res.json()
                setBreadcrumbs(data)
            } catch {
                setError('Failed to fetch data')
            } finally {
                setLoading(false)
                setIsPageChanging(false)

                // Плавно скрываем скелетоны
                setTimeout(() => {
                    setIsSkeletonVisible(false)
                }, TRANSITION_DURATION) // Устанавливаем задержку 1 секунда для скелетонов
            }
        }

        fetchBreadcrumbs()
    }, [pathname])

    // Если ошибка или главная страница — ничего не показываем
    if (error || isMainPage) {
        return null
    }

    return (
        <div className="mx-6 my-8">
            <hr className="mb-4 border-t border-gray-200 dark:border-gray-700" />
            <Breadcrumb>
                <BreadcrumbList
                    className="flex items-center gap-2"
                    style={{ minHeight: `${SKELETON_HEIGHT}px` }} // Устанавливаем минимальную высоту
                >
                    {isPageChanging || loading || isSkeletonVisible
                        ? renderSkeletons(INITIAL_SKELETON_COUNT)
                        : renderBreadcrumbs(breadcrumbs)
                    }
                </BreadcrumbList>
            </Breadcrumb>
            <hr className="mt-4 border-t border-gray-200 dark:border-gray-700" />
        </div>
    )
}

// 👉 Подкомпонент для отображения одного элемента хлебных крошек
function renderBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    return breadcrumbs.map((item, index) => (
        <div
            key={index}
            className={cn(
                "flex items-center",
                "opacity-100"
            )}
        >
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

// 👉 Подкомпонент для отображения скелетонов при загрузке
function renderSkeletons(count: number) {
    return Array.from({ length: count }).map((_, index) => (
        <div
            key={index}
            className={cn(
                "flex items-center",
            )}
        >
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
