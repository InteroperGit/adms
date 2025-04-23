"use client";

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/libs/utils';
import { projectPreviews } from "@/data/projects-data";
import HeroSection from "@/components/sections/HeroSection";
import CategoryFilter from "@/components/navigation/CategoryFilter";
import { CtaSection } from "@/components/sections/CtaSection";
import { LoadingMoreButton } from "@/components/buttons/LoadingMoreButton";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ProjectPreview } from "@/types/project";
import useServiceCategories from "@/hooks/useServiceCategories";
import {ServiceCategory} from "@/types/service";

const INIT_VISIBLE_PROJECTS = 10;

interface LoadingProjectsButtonProps {
    isLoadingMore: boolean;
    hasMoreProjects: boolean;
    onLoadMore: () => void;
    filteredProjectsLength: number;
}

function LoadingProjectsButton({
                                  isLoadingMore,
                                  hasMoreProjects,
                                  onLoadMore,
                                  filteredProjectsLength,
                              }: LoadingProjectsButtonProps) {
    return hasMoreProjects ? (
        <LoadingMoreButton isLoading={isLoadingMore} onClick={onLoadMore}>
            Показать еще
        </LoadingMoreButton>
    ) : (
        <div className="text-gray-500 dark:text-gray-400 py-4">
            {filteredProjectsLength > 10 ? 'Все проекты загружены' : ''}
        </div>
    );
}

interface ShowAllProjectsButtonProps {
    onClick: () => void;
}

function ShowAllProjectsButton({ onClick }: ShowAllProjectsButtonProps) {
    return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">В этой категории пока нет проектов</p>
            <button
                onClick={onClick}
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
    );
}

function LoadingIndicator() {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );
}

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [visibleProjects, setVisibleProjects] = useState<number>(10);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState<ProjectPreview[]>(projectPreviews);
    const { categories: serviceCategories, loading: serviceCategoriesLoading } = useServiceCategories();

    useEffect(() => {
        // Сброс видимых проектов при изменении категории
        setVisibleProjects(INIT_VISIBLE_PROJECTS);
        setFilteredProjects(
            activeCategory === 'all'
                ? projectPreviews
                : projectPreviews.filter(project => project.category?.name === activeCategory)
        );
    }, [activeCategory]);

    const uiServiceCategories: ServiceCategory[] = useMemo(() => {
        if (serviceCategoriesLoading) {
            return [];
        }

        return [
            { id: 1, name: 'all', title: 'Все работы' },
            ...serviceCategories,
        ];
    }, [serviceCategoriesLoading, serviceCategories]);

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
                    : `Проекты в категории "${uiServiceCategories.find(c => c.name === activeCategory)?.title || ''}"`}
            />

            {/* Фильтры */}
            <section className={cn("py-12 px-2 md:px-6")}>
                {/* Показываем скелетон во время загрузки */}
                <CategoryFilter
                    categories={uiServiceCategories}
                    activeCategory={activeCategory}
                    onCategoryChange={(slug) => setActiveCategory(slug)}
                    loading={serviceCategoriesLoading}
                />
            </section>

            {/* Секция портфолио */}
            <section className={cn("pb-12 px-2 md:px-6")}>
                {/* Список проектов */}
                {isLoading ? (
                    <LoadingIndicator />
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
                        />

                        {/* Кнопка загрузки и статус */}
                        <div className="mt-12 text-center">
                            <LoadingProjectsButton
                                isLoadingMore={isLoadingMore}
                                hasMoreProjects={hasMoreProjects}
                                onLoadMore={loadMoreProjects}
                                filteredProjectsLength={filteredProjects.length}
                            />

                            {projectsToShow.length === 0 && (
                                <ShowAllProjectsButton
                                    onClick={() => handleCategoryChange('all')}
                                />
                            )}
                        </div>
                    </>
                )}
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
