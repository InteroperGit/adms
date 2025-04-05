import {ServicesSection} from "@/components/sections/ServicesSection";
import {serviceCategories} from "@/data/services-data";
import {PortfolioSection} from "@/components/sections/PortfolioSection";
import {recentProjectPreviews} from "@/data/projects-data";
import {NewsSection} from "@/components/sections/NewsSection";
import {recentNewsPreviews} from "@/data/news-data";
import HeroSection from "@/components/sections/HeroSection";
import {ClientsSection} from "@/components/sections/ClientsSection";
import React from "react";
import AboutCompanySection from "@/components/sections/AboutCompanySection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import CarouselSection from "@/components/sections/CarouselSection";
import {getPromotions} from "@/libs/api/promotions";
import {getCompanyProductionImages, getCompanyStats} from "@/libs/api/company-info";
import WorkStepsSection from "@/components/sections/WorkStepsSection";

async function CarouselWrapper() {
    const promotions = await getPromotions();
    return <CarouselSection promotions={promotions} className={"hidden md:block"} />;
}

async function AboutCompanyWrapper() {
    const companyStats = await getCompanyStats();
    const companyProductImages = await getCompanyProductionImages();

    return <AboutCompanySection stats={companyStats} productionImages={companyProductImages} />
}

export default function Home() {
    return (
        <div className="space-y-12 pb-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* 1. Карусель спецпредложений */}
            <CarouselWrapper />

            {/* 2. Hero Banner */}
            <HeroSection
                title={"Рекламное агентство полного цикла"}
                description={"Создаем эффективные решения с 2009 года"}
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
                className="my-9 py-6 bg-white dark:bg-gray-800 px-6 rounded-lg border dark:border-gray-700"
            />

            {/* 6. Этапы работы */}
            <WorkStepsSection />

            {/* 7. Портфолио */}
            <PortfolioSection
                title="Наше портфолио"
                description="Лучшие проекты за последние годы"
                projects={recentProjectPreviews}
                columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: 3
                }}
                className="py-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700"
            />

            {/* 8. Новости */}
            <NewsSection
                title="Последние события"
                articles={recentNewsPreviews}
                columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: 3
                }}
                maxItems={6}
                className="py-6 bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700"
            />

            {/* 9. Клиенты */}
            <ClientsSection className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700" />

            {/* 10. FAQ */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Частые вопросы</h2>
                <div className="space-y-4">
                    {[
                        {q: 'Какой срок производства?', a: 'От 3 до 14 дней в зависимости от сложности'},
                        {q: 'Есть ли доставка?', a: 'Да, доставляем по всему городу и области'},
                        {q: 'Даете ли гарантию?', a: 'Гарантия от 6 месяцев на все работы'}
                    ].map((item, i) => (
                        <div key={i} className="border-b dark:border-gray-700 pb-4">
                            <h3 className="font-bold mb-2 dark:text-gray-200">{item.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 11. Форма заявки */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-lg border border-blue-100 dark:border-orange-800">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Оставить заявку</h2>
                <form className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Телефон"
                            className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-600 dark:bg-orange-700 text-white py-3 rounded font-bold hover:bg-orange-700 dark:hover:bg-orange-800 transition"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
}