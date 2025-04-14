"use client"

import HeroSection from "@/components/sections/HeroSection";
import {CtaSection} from "@/components/sections/CtaSection";
import {services} from "@/data/services-data";
import {ServicesSection} from "@/components/sections/ServicesSection";

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
                    services={services}
                    columns={4}
                    className="my-16"
                />

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