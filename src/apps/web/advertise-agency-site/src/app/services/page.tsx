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
        <>
            <PageHeader>Услуги</PageHeader>
        </>
    );
}