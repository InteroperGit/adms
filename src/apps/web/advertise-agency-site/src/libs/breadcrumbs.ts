import {useBreadcrumbs} from '@/contexts/breadcrumbs-context'
import {useCallback} from "react";

export function useUpdateBreadcrumbs() {
    const { setBreadcrumbs } = useBreadcrumbs()

    return useCallback((items: { title: string; href?: string }[]) => {
        setBreadcrumbs(items)
    }, [setBreadcrumbs])
}