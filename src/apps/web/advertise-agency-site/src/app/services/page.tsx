"use client"

import {useUpdateBreadcrumbs} from "@/libs/breadcrumbs";
import {useEffect} from "react";
import HeroSection from "@/components/sections/HeroSection";
import {SpecialServiceCard} from "@/components/cards/SpecialServiceCard";
import {CtaSection} from "@/components/sections/CtaSection";
import {serviceCategories, specialServices} from "@/data/services-data";
import {ServicesSection} from "@/components/sections/ServicesSection";

export default function ServicesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Услуги' }
        ])
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero секция */}
            <HeroSection
                title={"Наши услуги"}
                description={"Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации"}
            />

            {/* Основной контент */}
            <div className="container mx-auto px-4 py-12">
                {/* Категории услуг */}
                <ServicesSection
                    title="Наши услуги"
                    services={serviceCategories}
                    columns={4}
                    className="my-16"
                />

                {/* Дополнительные услуги */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Специализированные решения</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specialServices.map((service, index) => (
                            <SpecialServiceCard
                                key={index}
                                service={service}
                                index={index}
                                accentColor="orange"
                                gridColumns={2}
                                className="hover:shadow-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* CTA блок */}
                <CtaSection
                    title="Не нашли нужную услугу?"
                    description="Расскажите нам о вашем проекте, и мы предложим оптимальное решение"
                    buttonText="Обсудить проект"
                    buttonHref="/contacts"
                    className="dark:bg-gray-900 dark:text-gray-100"
                />
            </div>
        </div>
    )
}