"use client"

import { ServiceCard } from "@/components/cards/ServiceCard"
import { cn } from "@/libs/utils"
import React from "react";
import {ServiceCategory} from "@/types/service";

interface ServicesSectionProps {
    title?: string
    services: ServiceCategory[]
    className?: string
    columns?: 1 | 2 | 3 | 4
}

/**
 * ServicesSection - Секция услуг с карточками категорий.
 *
 * Компонент отображает:
 * - Заголовок и описание секции
 * - Сетку карточек услуг (ServiceCard)
 *
 * Особенности:
 * - Адаптивное количество колонок
 * - Поддержка темной темы
 * - Кастомизируемый заголовок
 *
 * @example
 * // Базовое использование
 * <ServicesSection services={servicesData} />
 *
 * @example
 * // С кастомизацией
 * <ServicesSection
 *   title="Наши услуги"
 *   services={services}
 *   columns={3}
 *   className="my-12"
 * />
 */
export default function ServicesSection({
                                    title = "Наши услуги",
                                    services,
                                    className,
                                    columns = 3,
                                }: ServicesSectionProps) {
    const gridClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }

    return (
        <section className={cn(className)}>
            {/* Заголовок секции */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
            </div>

            {/* Сетка карточек услуг */}
            <div className={cn("grid gap-6", gridClasses[columns])}>
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        service={service}
                        index={index}
                        className="h-full"
                    />
                ))}
            </div>
        </section>
    )
}