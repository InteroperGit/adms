"use client"

import {useEffect, useState} from 'react';
import { cn } from '@/libs/utils';
import {useUpdateBreadcrumbs} from "@/libs/breadcrumbs";
import {projects} from "@/data/projects-data";
import {categories} from "@/data/categories-data";
import HeroSection from "@/components/sections/HeroSection";
import {CategoryFilter} from "@/components/navigation/CategoryFilter";
import {CtaSection} from "@/components/sections/CtaSection";
import {LoadingMoreButton} from "@/components/buttons/LoadingMoreButton";
import {PortfolioSection} from "@/components/sections/PortfolioSection";

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [visibleProjects, setVisibleProjects] = useState<number>(10);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Портфолио' }
        ]);
    }, [updateBreadcrumbs]);

    useEffect(() => {
        // Сброс видимых проектов при изменении категории
        setVisibleProjects(10);
    }, [activeCategory]);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(project => project.category?.name === activeCategory);

    const projectsToShow = filteredProjects.slice(0, visibleProjects);
    const hasMoreProjects = visibleProjects < filteredProjects.length;

    const handleCategoryChange = (slug: string) => {
        setIsLoading(true);
        setActiveCategory(slug);
        setTimeout(() => setIsLoading(false), 300);
    };

    const loadMoreProjects = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleProjects(prev => prev + 10);
            setIsLoadingMore(false);

            // Плавная прокрутка к новым элементам
            setTimeout(() => {
                const cards = document.querySelectorAll('.project-card');
                if (cards.length > 0) {
                    cards[cards.length - 1].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 100);
        }, 800);
    };

    return (
        <div className={cn("bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen")}>
            {/* Hero секция */}
            <HeroSection
                title={"Наши работы"}
                description={activeCategory === 'all'
                    ? 'Реализованные проекты за последние годы'
                    : `Проекты в категории "${categories.find(c => c.slug === activeCategory)?.name || ''}"`}
            />

            {/* Фильтры */}
            <section className={cn("py-12 px-6")}>
                <div>
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={(slug) => setActiveCategory(slug)}
                        className="my-8" // Дополнительные стили
                    />

                    {/* Список проектов */}
                    {isLoading ? (
                        <div className={cn("flex justify-center items-center h-64")}>
                            <div className={cn("animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500")}></div>
                        </div>
                    ) : (
                        <>
                            <PortfolioSection
                                title="Наше портфолио"
                                description="Лучшие проекты за последние годы"
                                projects={projectsToShow}
                                columns={{
                                    mobile: 1,
                                    tablet: 2,
                                    desktop: 3
                                }}
                                className="py-16"
                            />

                            {/* Кнопка загрузки и статус */}
                            <div className="mt-12 text-center">
                                {hasMoreProjects ? (
                                    <LoadingMoreButton
                                        isLoading={isLoadingMore}
                                        onClick={loadMoreProjects}>
                                        Показать еше
                                    </LoadingMoreButton>
                                ) : (
                                    <div className="text-gray-500 dark:text-gray-400 py-4">
                                        {filteredProjects.length > 10 ? 'Все проекты загружены' : ''}
                                    </div>
                                )}

                                {projectsToShow.length === 0 && (
                                    <div className={cn("text-center py-12 text-gray-500 dark:text-gray-400")}>
                                        <p className="text-lg">В этой категории пока нет проектов</p>
                                        <button
                                            onClick={() => handleCategoryChange('all')}
                                            className={cn(
                                                "mt-4 px-4 py-2",
                                                "bg-orange-100 dark:bg-orange-900/30",
                                                "text-orange-600 dark:text-orange-300",
                                                "rounded-md hover:bg-orange-200 dark:hover:bg-orange-800/50",
                                                "transition-colors duration-200"
                                            )}
                                        >
                                            Показать все работы
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA секция */}
            <CtaSection
                title="Хотите такой же результат?"
                description="Оставьте заявку и мы обсудим ваш проект"
                buttonText="Написать нам"
                buttonHref="/contacts"
                className="dark:bg-gray-900 dark:text-gray-100"
            />
        </div>
    );
}