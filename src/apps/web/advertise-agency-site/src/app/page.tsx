import { ServicesSection } from "@/components/sections/ServicesSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { recentNewsArticles } from "@/data/newsData";
import HeroSection from "@/components/sections/HeroSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import React from "react";
import AboutCompanySection from "@/components/sections/AboutCompanySection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import CarouselSection from "@/components/sections/CarouselSection";
import { getPromotions } from "@/libs/api/promotionsApi";
import { getCompanyProductionImages, getCompanyStats } from "@/libs/api/companyInfoApi";
import WorkStepsSection from "@/components/sections/WorkStepsSection";
import FaqSection from "@/components/sections/FaqSection";
import OrderFormSection from "@/components/sections/OrderFormSection";
import { cn } from "@/libs/utils";
import {getServiceCategories} from "@/libs/api/servicesApi";
import {getProjectArticles} from "@/libs/api/projectsApi";
import {ALL_SERVICE_CATEGORY_NAME, DEFAULT_PORTFOLIO_PAGE_SIZE} from "@/config/constants";

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
    const serviceCategories = await getServiceCategories("header");
    const projectsResult = await getProjectArticles({
        category: ALL_SERVICE_CATEGORY_NAME,
        page: 1,
        pageSize: DEFAULT_PORTFOLIO_PAGE_SIZE
    });
    const projects = projectsResult.articles;

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
                services={serviceCategories}
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
                projects={projects}
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
