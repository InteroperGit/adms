"use client"

import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import PageHeader from "@/components/misc/PageHeader";

export default function ServicesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Услуги' }
        ])
    }, []);

    return (
        <div className={"container mx-auto px-4 py-12"}>
            <PageHeader>Услуги</PageHeader>
        </div>
    );
}