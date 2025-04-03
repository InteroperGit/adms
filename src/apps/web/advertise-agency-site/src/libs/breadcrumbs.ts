import {useBreadcrumbs} from '@/contexts/breadcrumbs-context'

export function useUpdateBreadcrumbs() {
    const { setBreadcrumbs } = useBreadcrumbs()

    return (items: { title: string; href?: string }[]) => {
        setBreadcrumbs(items)
    }
}