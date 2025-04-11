"use client"

import HeroSection from "@/components/sections/HeroSection";
import {CtaSection} from "@/components/sections/CtaSection";
import {mainServices, specialServices} from "@/data/services-data";
import {ServicesSection} from "@/components/sections/ServicesSection";
import {ServiceCard} from "@/components/cards/ServiceCard";

export default function ServicesPage() {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero секция */}
            <HeroSection
                title={"Наши услуги"}
                description={"Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации"}
            />

            {/* Основной контент */}
            <div className="px-5">
                {/* Категории услуг */}
                <ServicesSection
                    title="Наши услуги"
                    services={mainServices}
                    columns={4}
                    className="my-16"
                />

                {/* Дополнительные услуги */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Специализированные решения</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-start">
                        {specialServices.map((service, index) => (
                            <ServiceCard
                                key={index}
                                service={service}
                                index={index}
                                accentColor="orange"
                                className="w-[300px]"
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