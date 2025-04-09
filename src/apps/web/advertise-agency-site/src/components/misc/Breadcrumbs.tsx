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

export function Breadcrumbs() {
    const pathname = usePathname()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

    useEffect(() => {
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
            }
        }

        fetchBreadcrumbs()
    }, [pathname])

    if (loading || error) {
        return null
    }

    return (
        <div className="mx-6 my-8">
            <hr className="mb-4 border-t border-gray-200 dark:border-gray-700" />
            <Breadcrumb>
                <BreadcrumbList className="flex items-center gap-2">
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center">
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
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <hr className="mt-4 border-t border-gray-200 dark:border-gray-700" />
        </div>
    )
}
