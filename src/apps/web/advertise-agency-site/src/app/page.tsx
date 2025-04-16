import { ServicesSection } from "@/components/sections/ServicesSection";
// import { services } from "@/data/services-data";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { recentProjectPreviews } from "@/data/projects-data";
import { NewsSection } from "@/components/sections/NewsSection";
import { recentNewsArticles } from "@/data/news-data";
import HeroSection from "@/components/sections/HeroSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import React from "react";
import AboutCompanySection from "@/components/sections/AboutCompanySection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import CarouselSection from "@/components/sections/CarouselSection";
import { getPromotions } from "@/libs/api/promotions-api";
import { getCompanyProductionImages, getCompanyStats } from "@/libs/api/company-info-api";
import WorkStepsSection from "@/components/sections/WorkStepsSection";
import FaqSection from "@/components/sections/FaqSection";
import OrderFormSection from "@/components/sections/OrderFormSection";
import { cn } from "@/libs/utils";
import {getAllServiceCategories} from "@/libs/api/services-api";

async function CarouselWrapper() {
    const promotions = await getPromotions();
    return (
        <CarouselSection promotions={promotions} className={cn("hidden md:block")} />
    );
}

async function AboutCompanyWrapper() {
    const companyStats = await getCompanyStats();
    const companyProductImages = await getCompanyProductionImages();

    return (
        <AboutCompanySection stats={companyStats}
            productionImages={companyProductImages}
        />
    );
}

export default async function Home() {
    const services = await getAllServiceCategories();

    return (
        <div className={cn("space-y-12 pb-16 bg-white dark:bg-gray-900",
            " text-gray-900 dark:text-gray-100")}>
            {/* 1. Карусель спецпредложений */}
            <CarouselWrapper />

            {/* 2. Hero Banner */}
            <HeroSection
                title="Рекламное агентство полного цикла"
                description="Создаем эффективные решения с 2009 года"
            />

            {/* 3. Преимущества */}
            <AdvantagesSection />

            {/* 4. О компании */}
            <AboutCompanyWrapper />

            {/* 5. Услуги */}
            <ServicesSection
                title="Наши услуги"
                services={services}
                columns={4}
                className={cn(
                    "my-9 py-6 bg-white dark:bg-gray-800 px-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 6. Этапы работы */}
            <WorkStepsSection
                className={cn(
                    "bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 7. Портфолио */}
            <PortfolioSection
                title="Наше портфолио"
                description="Лучшие проекты за последние годы"
                projects={recentProjectPreviews}
                columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: 3,
                }}
                className={cn(
                    "py-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 8. Новости */}
            <NewsSection
                title="Последние события"
                articles={recentNewsArticles}
                columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: 3,
                }}
                maxItems={6}
                className={cn(
                    "py-6 bg-white dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 9. Клиенты */}
            <ClientsSection
                className={cn(
                    "bg-white dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 10. FAQ */}
            <FaqSection
                className={cn(
                    "bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 11. Форма заявки */}
            <OrderFormSection
                className={cn(
                    "bg-orange-50 dark:bg-orange-900/20 p-8 rounded-lg border",
                    "border-blue-100 dark:border-orange-800"
                )}
            />
        </div>
    );
}
