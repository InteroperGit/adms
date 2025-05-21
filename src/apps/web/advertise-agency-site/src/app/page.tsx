import React, {JSX} from "react";
import { cn } from "@/libs/utils";

import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import NewsSection from "@/components/sections/NewsSection";
import HeroSection from "@/components/sections/HeroSection";
import ClientsSection from "@/components/sections/ClientsSection";
import AboutCompanySection from "@/components/sections/AboutCompanySection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import CarouselSection from "@/components/sections/CarouselSection";
import WorkStepsSection from "@/components/sections/WorkStepsSection";
import FaqSection from "@/components/sections/FaqSection";
import OrderFormSection from "@/components/sections/OrderFormSection";
import ReviewsSection from "@/components/sections/ReviewsSection";

import { getServiceCategories } from "@/libs/api/servicesApi";
import { getProjectArticles } from "@/libs/api/projectsApi";
import { getNewsArticles } from "@/libs/api/newsApi";
import { getCompanyAdvantages } from "@/libs/api/companyAdvantagesApi";
import { getPromotions } from "@/libs/api/promotionsApi";
import { getAboutCompany } from "@/libs/api/aboutCompanyApi";
import { getCompanyWorkSteps } from "@/libs/api/companyWorkStepsApi";
import { getFaq } from "@/libs/api/faqApi";
import { getClients } from "@/libs/api/clientApi";

import {
    ALL_SERVICE_CATEGORY_NAME,
    DEFAULT_NEWS_PAGE_SIZE,
    DEFAULT_PORTFOLIO_PAGE_SIZE
} from "@/config/constants";
import {getYandexCompanyId} from "@/libs/envUtils";

const YANDEX_COMPANY_ID = getYandexCompanyId();

/**
 * Главная страница сайта, которая отображает различные секции с контентом:
 * карусель спецпредложений, информацию о компании, услуги, портфолио,
 * новости, отзывы, FAQ, форму заявки и другие.
 *
 * @returns {JSX.Element} - Разметка главной страницы, включая все секции.
 *
 * Пример использования:
 * <Home />
 */
const Home = async (): Promise<JSX.Element> => {
    let serviceCategories,
        projects,
        news,
        promotions,
        advantages,
        aboutCompany,
        workSteps,
        faq,
        clients;

    try {
        serviceCategories = await getServiceCategories("header");
        const { articles: projectArticles } = await getProjectArticles({
            category: ALL_SERVICE_CATEGORY_NAME,
            page: 1,
            pageSize: DEFAULT_PORTFOLIO_PAGE_SIZE
        });
        projects = projectArticles;

        const { articles: newsArticles } = await getNewsArticles({
            page: 1,
            pageSize: DEFAULT_NEWS_PAGE_SIZE
        });
        news = newsArticles;
        promotions = await getPromotions();
        advantages = await getCompanyAdvantages();
        aboutCompany = await getAboutCompany();
        workSteps = await getCompanyWorkSteps();
        faq = await getFaq();
        clients = await getClients();

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error instanceof Error ? error.message : error);
        return <div className="text-red-500">Произошла ошибка при загрузке данных.</div>;
    }

    return (
        <div className={cn("space-y-12 pb-16 bg-white dark:bg-gray-900",
            " text-gray-900 dark:text-gray-100")}>
            {/* 1. Карусель спецпредложений */}
            <CarouselSection promotions={promotions} className={cn("hidden md:block")} />

            {/* 2. Hero Banner */}
            <HeroSection
                title="Рекламное агентство полного цикла"
                description="Создаем эффективные решения с 2009 года"
            />

            {/* 3. Преимущества */}
            <AdvantagesSection advantages={advantages} />

            {/* 4. О компании */}
            <AboutCompanySection aboutCompany={aboutCompany} />

            {/* 5. Услуги */}
            <ServicesSection
                title="Наши услуги"
                services={serviceCategories}
                columns={4}
                className={cn(
                    "my-9 p-6 bg-white dark:bg-gray-800 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 6. Этапы работы */}
            <WorkStepsSection
                workSteps={workSteps}
                className={cn(
                    "bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border",
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
                    "bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 8. Новости */}
            <NewsSection
                title="Новости"
                news={news}
                columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: 3,
                }}
                maxItems={6}
                className={cn(
                    "bg-white dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 9. Отзывы */}
            <ReviewsSection
                yandexCompanyId={YANDEX_COMPANY_ID}
                className={cn(
                    "bg-gray-50 dark:bg-gray-800 p-1 md:p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 10. Клиенты */}
            <ClientsSection
                clients={clients}
                className={cn(
                    "bg-white dark:bg-gray-800 p-6 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 11. FAQ */}
            <FaqSection
                faq={faq}
                className={cn(
                    "bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border",
                    "dark:border-gray-700"
                )}
            />

            {/* 12. Форма заявки */}
            <OrderFormSection
                className={cn(
                    "bg-orange-50 dark:bg-orange-900/20 p-8 rounded-lg border",
                    "border-blue-100 dark:border-orange-800"
                )}
            />
        </div>
    );
}

export default Home;
