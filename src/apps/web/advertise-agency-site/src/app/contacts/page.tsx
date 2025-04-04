"use client"

import YandexMap from "@/components/misc/YandexMap";
import ContactsCard from "@/components/cards/ContactsCard";
import FeedbackForm from "@/components/forms/FeedbackForm";
import {useUpdateBreadcrumbs} from "@/libs/breadcrumbs";
import {useEffect} from "react";
import PageHeader from "@/components/misc/PageHeader";

export default function ContactsPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Контакты' }
        ])
    }, [updateBreadcrumbs]);

    return (
        <>
            <PageHeader>Контакты</PageHeader>

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
                {/* Левая колонка - контактная информация */}
                <div className={"space-y-6"}>
                    <ContactsCard />

                    <YandexMap
                        constructorId="8e9d4dd92e269a69df84774136ae2871466aa55b34f941cb126cfc03efab1fb8"
                        height="400px"
                    />
                </div>

                {/* Форма обратной связи */}
                <FeedbackForm />
            </div>
        </>
    );
}