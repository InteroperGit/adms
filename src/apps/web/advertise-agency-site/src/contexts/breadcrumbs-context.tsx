"use client"

import React, {createContext, useState, ReactNode, useContext} from 'react'

type BreadcrumbItem = {
    title: string
    href?: string
    icon?: React.ReactNode
    isCurrent?: boolean
}

type BreadcrumbsContextType = {
    breadcrumbs: BreadcrumbItem[]
    setBreadcrumbs: (items: BreadcrumbItem[]) => void
    cache: Record<string, BreadcrumbItem[]>
    addToCache: (key: string, items: BreadcrumbItem[]) => void
    restoreFromCache: (key: string) => void // Добавлено в тип
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(undefined)

export function BreadcrumbsProvider({ children }: { children: ReactNode }) {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
    const [cache, setCache] = useState<Record<string, BreadcrumbItem[]>>({})

    const addToCache = (key: string, items: BreadcrumbItem[]) => {
        setCache(prev => ({ ...prev, [key]: items }))
    }

    // Восстановление из кэша при изменении пути
    const restoreFromCache = (key: string) => {
        if (cache[key]) {
            setBreadcrumbs(cache[key])
        }
    }

    return (
        <BreadcrumbsContext.Provider
            value={{ breadcrumbs, setBreadcrumbs, cache, addToCache, restoreFromCache }}
        >
            {children}
        </BreadcrumbsContext.Provider>
    )
}

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbsContext)
    if (!context) {
        throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider')
    }
    return context
}