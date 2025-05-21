'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BreadcrumbItem } from '@/types/breadcrumbs'
import {getBreadcrumbsApiUrl} from "@/libs/envUtils";

const BREADCRUMBS_API_URL = getBreadcrumbsApiUrl();

interface BreadcrumbsContextType {
    breadcrumbs: BreadcrumbItem[];
    loading: boolean;
    error: string | null;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
    breadcrumbs: [],
    loading: true,
    error: null,
})

/**
 * BreadcrumbsProvider - провайдер контекста для хлебных крошек
 *
 * Этот провайдер:
 *
 * 1. Отслеживает изменения текущего URL (pathname) через usePathname()
 * 2. При каждом изменении пути:
 *    - Устанавливает состояние loading в true
 *    - Делает запрос к API (/api/breadcrumbs) для получения данных
 *    - Обрабатывает успешный ответ или ошибки
 *    - Обновляет контекст с полученными данными
 *
 * 3. Предоставляет через контекст:
 *    - breadcrumbs: массив элементов {title: string, href?: string, isCurrent?: boolean}
 *    - loading: флаг загрузки данных (boolean)
 *    - error: сообщение об ошибке или null
 *
 * 4. Особенности работы:
 *    - Автоматически обновляет данные при смене маршрута
 *    - Гарантирует согласованность данных между компонентами
 *    - Обрабатывает ошибки запросов
 *    - Оптимизирует обновления (не вызывает лишних ререндеров)
 *
 * Рекомендации по использованию:
 * 1. Оберните корневой layout этим провайдером
 * 2. Для доступа к данным используйте хук useBreadcrumbs()
 * 3. В компонентах проверяйте состояния loading и error
 *
 * Пример использования:
 *
 * // В layout.tsx
 * <BreadcrumbsProvider>
 *   <App />
 * </BreadcrumbsProvider>
 *
 * // В компонентах
 * const { breadcrumbs, loading, error } = useBreadcrumbs()
 *
 * @param {Object} props - Свойства провайдера
 * @param {React.ReactNode} props.children - Дочерние компоненты
 *
 * @returns {React.ReactElement} Провайдер контекста
 *
 * @see useBreadcrumbs для получения данных в компонентах
 */
export function BreadcrumbsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [state, setState] = useState<BreadcrumbsContextType>({
        breadcrumbs: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchBreadcrumbs = async () => {
            try {
                setState(prev => ({ ...prev, loading: true }));

                const res = await fetch(`${BREADCRUMBS_API_URL}${pathname}`)
                if (!res.ok) {
                    throw new Error("Network response failed")
                }

                const data = await res.json();
                setState({ breadcrumbs: data, loading: false, error: null })
            }
            catch(err) {
                console.error(`Failed to fetch breadcrumbs: ${err}`);
                setState({ breadcrumbs: [], loading: false, error: 'Failed to fetch data' })
            }
        }

        fetchBreadcrumbs()
    }, [pathname])

    return (
        <BreadcrumbsContext.Provider value={state}>
            {children}
        </BreadcrumbsContext.Provider>
    )
}

export const useBreadcrumbs = () => useContext(BreadcrumbsContext)