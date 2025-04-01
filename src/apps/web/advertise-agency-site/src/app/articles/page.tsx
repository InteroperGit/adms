"use client"

import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import PageHeader from "@/components/misc/PageHeader";

export default function ArticlesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Статьи' }
        ])
    }, []);

    return (
        <div className={"container mx-auto px-4 py-12"}>
            <PageHeader>Статьи</PageHeader>
        </div>
    );
}