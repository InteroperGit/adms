'use client'

import { useBreadcrumbs } from '@/contexts/breadcrumbs-context'
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from "lucide-react";
import {cn} from "@/lib/utils";
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
    const { breadcrumbs } = useBreadcrumbs()
    const pathname = usePathname()

    if (breadcrumbs.length === 0 || pathname === "/")
    {
        return null
    }

    return (
        <div className="m-6">
            <Breadcrumb>
                <BreadcrumbList className="flex items-center gap-2">
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <BreadcrumbItem className="text-sm">
                                {item.href ? (
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
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator className="mx-2 text-gray-400 dark:text-gray-500">
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>
                            )}
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}