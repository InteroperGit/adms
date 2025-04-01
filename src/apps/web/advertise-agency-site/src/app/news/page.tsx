"use client"

import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import PageHeader from "@/components/misc/PageHeader";

export default function NewsPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Новости' }
        ])
    }, []);

    return (
        <div className={"container mx-auto px-4 py-12"}>
            <PageHeader>Новости</PageHeader>
        </div>
    );
}