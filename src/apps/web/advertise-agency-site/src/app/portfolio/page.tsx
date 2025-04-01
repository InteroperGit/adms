"use client"

import Link from 'next/link';
import {useEffect, useState} from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";

type Project = {
    id: number;
    title: string;
    category: string;
    client: string;
    year: string;
    imageUrl: string;
    slug: string;
    description?: string;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

// Категории
const categories: Category[] = [
    { id: 1, name: 'Все работы', slug: 'all' },
    { id: 2, name: 'Брендирование', slug: 'branding' },
    { id: 3, name: 'Наружная реклама', slug: 'outdoor' },
    { id: 4, name: 'Полиграфия', slug: 'printing' },
    { id: 5, name: 'Упаковка', slug: 'packaging' }
];

// 30 проектов с реальными изображениями
const projects: Project[] = [
    {
        id: 1,
        title: 'Брендирование кафе "Sunrise"',
        category: 'branding',
        client: 'Сеть кофеен Sunrise',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format',
        slug: 'sunrise-cafe',
        description: 'Полный ребрендинг сети кофеен'
    },
    {
        id: 2,
        title: 'Вывеска для бутика "Elegance"',
        category: 'outdoor',
        client: 'Бутик Elegance',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format',
        slug: 'elegance-sign',
        description: 'Световая вывеска для fashion-бутика'
    },
    {
        id: 3,
        title: 'Каталог продукции "TechLogic"',
        category: 'printing',
        client: 'TechLogic',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format',
        slug: 'techlogic-catalog',
        description: 'Полиграфический каталог на 120 страниц'
    },
    {
        id: 4,
        title: 'Упаковка для косметики "PureLine"',
        category: 'packaging',
        client: 'PureLine Cosmetics',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format',
        slug: 'pureline-packaging',
        description: 'Экологичная упаковка для косметики'
    },
    {
        id: 5,
        title: 'Брендбук "Global Finance"',
        category: 'branding',
        client: 'Global Finance',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format',
        slug: 'global-finance-brandbook',
        description: 'Разработка полного брендбука'
    },
    {
        id: 6,
        title: 'Билборды для автосалона "Premium Motors"',
        category: 'outdoor',
        client: 'Premium Motors',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format',
        slug: 'premium-motors-billboards',
        description: 'Серия билбордов для премиального автосалона'
    },
    {
        id: 7,
        title: 'Фирменные бланки "LegalTrust"',
        category: 'printing',
        client: 'LegalTrust',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format',
        slug: 'legaltrust-stationery',
        description: 'Разработка фирменных бланков для юридической компании'
    },
    {
        id: 8,
        title: 'Упаковка для чая "Mountain Leaf"',
        category: 'packaging',
        client: 'Mountain Leaf',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?w=800&auto=format',
        slug: 'mountain-leaf-tea',
        description: 'Экологичная упаковка для премиального чая'
    },
    {
        id: 9,
        title: 'Логотип и айдентика "UrbanFit"',
        category: 'branding',
        client: 'UrbanFit Gym',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format',
        slug: 'urbanfit-branding',
        description: 'Разработка логотипа и фирменного стиля для фитнес-клуба'
    },
    {
        id: 10,
        title: 'Световая вывеска "Grand Hotel"',
        category: 'outdoor',
        client: 'Grand Hotel',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format',
        slug: 'grand-hotel-sign',
        description: 'Неоновая вывеска для отеля премиум-класса'
    },
    {
        id: 11,
        title: 'Визитки "Architect Studio"',
        category: 'printing',
        client: 'Architect Studio',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format',
        slug: 'architect-visit-cards',
        description: 'Минималистичные визитки для архитектурного бюро'
    },
    {
        id: 12,
        title: 'Упаковка для вина "Vineyard"',
        category: 'packaging',
        client: 'Vineyard Estates',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format',
        slug: 'vineyard-wine',
        description: 'Дизайн упаковки для линейки премиальных вин'
    },
    {
        id: 13,
        title: 'Ребрендинг "CityBank"',
        category: 'branding',
        client: 'CityBank',
        year: '2021',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format',
        slug: 'citybank-rebranding',
        description: 'Полный ребрендинг банковской сети'
    },
    {
        id: 14,
        title: 'Рекламный щит "Summer Sale"',
        category: 'outdoor',
        client: 'MegaMall',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format',
        slug: 'megamall-billboard',
        description: 'Сезонная рекламная кампания для торгового центра'
    },
    {
        id: 15,
        title: 'Брошюра "HealthCare"',
        category: 'printing',
        client: 'HealthCare Clinic',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format',
        slug: 'healthcare-brochure',
        description: 'Информационная брошюра медицинского центра'
    },
    {
        id: 16,
        title: 'Упаковка для сладостей "SweetJoy"',
        category: 'packaging',
        client: 'SweetJoy',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=800&auto=format',
        slug: 'sweetjoy-packaging',
        description: 'Яркая упаковка для кондитерских изделий'
    },
    {
        id: 17,
        title: 'Фирменный стиль "EcoFood"',
        category: 'branding',
        client: 'EcoFood Market',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format',
        slug: 'ecofood-branding',
        description: 'Разработка айдентики для сети органических продуктов'
    },
    {
        id: 18,
        title: 'Вывеска "Coffee Time"',
        category: 'outdoor',
        client: 'Coffee Time',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&auto=format',
        slug: 'coffee-time-sign',
        description: 'Неоновая вывеска для кофейни'
    },
    {
        id: 19,
        title: 'Календарь "Art Gallery"',
        category: 'printing',
        client: 'Modern Art Gallery',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&auto=format',
        slug: 'art-gallery-calendar',
        description: 'Арт-календарь с работами современных художников'
    },
    {
        id: 20,
        title: 'Упаковка для парфюмерии "Luxury Scents"',
        category: 'packaging',
        client: 'Luxury Scents',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format',
        slug: 'luxury-scents-packaging',
        description: 'Роскошная упаковка для нишевой парфюмерии'
    },
    {
        id: 21,
        title: 'Логотип "TechStart"',
        category: 'branding',
        client: 'TechStart',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
        slug: 'techstart-logo',
        description: 'Современный логотип для IT-стартапа'
    },
    {
        id: 22,
        title: 'Рекламный стенд "AutoExpo"',
        category: 'outdoor',
        client: 'AutoExpo',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format',
        slug: 'autoexpo-stand',
        description: 'Дизайн и производство рекламного стенда для автосалона'
    },
    {
        id: 23,
        title: 'Флаеры "NightClub"',
        category: 'printing',
        client: 'Pulse NightClub',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?w=800&auto=format',
        slug: 'nightclub-flyers',
        description: 'Яркие флаеры для ночного клуба'
    },
    {
        id: 24,
        title: 'Упаковка для кофе "Morning Brew"',
        category: 'packaging',
        client: 'Morning Brew',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&auto=format',
        slug: 'morning-brew-coffee',
        description: 'Дизайн упаковки для зернового кофе'
    },
    {
        id: 25,
        title: 'Айдентика "FitnessPro"',
        category: 'branding',
        client: 'FitnessPro',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format',
        slug: 'fitnesspro-branding',
        description: 'Фирменный стиль для сети фитнес-центров'
    },
    {
        id: 26,
        title: 'Баннеры "Summer Festival"',
        category: 'outdoor',
        client: 'City Events',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format',
        slug: 'summer-festival-banners',
        description: 'Серия баннеров для городского фестиваля'
    },
    {
        id: 27,
        title: 'Буклет "Dental Care"',
        category: 'printing',
        client: 'Dental Care Clinic',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format',
        slug: 'dental-care-booklet',
        description: 'Информационный буклет стоматологической клиники'
    },
    {
        id: 28,
        title: 'Упаковка для чая "Green Valley"',
        category: 'packaging',
        client: 'Green Valley',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format',
        slug: 'green-valley-tea',
        description: 'Эко-упаковка для органического чая'
    },
    {
        id: 29,
        title: 'Логотип "Law Partners"',
        category: 'branding',
        client: 'Law Partners',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format',
        slug: 'law-partners-logo',
        description: 'Логотип для юридической фирмы'
    },
    {
        id: 30,
        title: 'Вывеска "BookStore"',
        category: 'outdoor',
        client: 'BookStore',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format',
        slug: 'bookstore-sign',
        description: 'Книжная вывеска для магазина'
    }
];

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
        // Сброс видимых проектов при изменении категории
        setVisibleProjects(10);
    }, [activeCategory]);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(project => project.category === activeCategory);

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
            <section className={cn("relative bg-orange-50 dark:bg-orange-900/20 py-20 px-6")}>
                <div className={cn("container mx-auto text-center")}>
                    <h1 className={cn("text-4xl md:text-5xl font-bold mb-6")}>Наши работы</h1>
                    <p className={cn("text-xl max-w-2xl mx-auto")}>
                        {activeCategory === 'all'
                            ? 'Реализованные проекты за последние годы'
                            : `Проекты в категории "${categories.find(c => c.slug === activeCategory)?.name || ''}"`}
                    </p>
                </div>
            </section>

            {/* Фильтры */}
            <section className={cn("py-12 px-6")}>
                <div className="container mx-auto">
                    <div className={cn("flex flex-wrap justify-center gap-2 md:gap-4 mb-12")}>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.slug)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm md:text-base transition-colors duration-200",
                                    activeCategory === category.slug
                                        ? "bg-orange-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Список проектов */}
                    {isLoading ? (
                        <div className={cn("flex justify-center items-center h-64")}>
                            <div className={cn("animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500")}></div>
                        </div>
                    ) : (
                        <>
                            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8")}>
                                {projectsToShow.map((project, index) => (
                                    <div
                                        key={project.id}
                                        className={cn(
                                            "group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl",
                                            "transition-all duration-300 h-full flex flex-col project-card"
                                        )}
                                    >
                                        <Link href={`/portfolio/${project.id}`} className="flex-1 flex flex-col">
                                            <div className={cn("aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800 overflow-hidden flex-1")}>
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={`Проект: ${project.title}`}
                                                    width={800}
                                                    height={600}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                    priority={index < 6} // Оптимизация загрузки первых изображений
                                                />
                                            </div>
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent",
                                                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                                "flex items-end p-6"
                                            )}>
                                                <div className={cn(
                                                    "transform translate-y-4 group-hover:translate-y-0",
                                                    "transition-transform duration-300"
                                                )}>
                                                    <h3 className={cn("text-white text-xl font-bold mb-1")}>{project.title}</h3>
                                                    <p className={cn("text-orange-200 text-sm")}>{project.client} • {project.year}</p>
                                                </div>
                                            </div>
                                            <div className={cn("p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700")}>
                                                <h3 className={cn("font-bold line-clamp-1")}>{project.title}</h3>
                                                <div className={cn("flex justify-between items-center mt-2")}>
                                                    <span className={cn(
                                                        "text-sm px-2 py-1 rounded",
                                                        "bg-orange-100 dark:bg-orange-900/30",
                                                        "text-orange-800 dark:text-orange-200"
                                                    )}>
                                                        {categories.find(c => c.slug === project.category)?.name}
                                                    </span>
                                                    <span className={cn("text-sm text-gray-500 dark:text-gray-400")}>{project.year}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Кнопка загрузки и статус */}
                            <div className="mt-12 text-center">
                                {hasMoreProjects ? (
                                    <button
                                        onClick={loadMoreProjects}
                                        disabled={isLoadingMore}
                                        className={cn(
                                            "px-8 py-3 rounded-full font-medium",
                                            "bg-orange-600 text-white hover:bg-orange-700",
                                            "transition-colors duration-200 relative",
                                            "flex items-center justify-center mx-auto",
                                            "min-w-[200px]"
                                        )}
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <span className="mr-2">Загрузка...</span>
                                                <div className={cn("animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white")}></div>
                                            </>
                                        ) : (
                                            'Показать еще'
                                        )}
                                    </button>
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
            <section className={cn("bg-orange-600 dark:bg-orange-800 text-white py-16 px-6")}>
                <div className={cn("container mx-auto text-center")}>
                    <h2 className={cn("text-2xl md:text-3xl font-bold mb-6")}>Хотите такой же результат?</h2>
                    <p className={cn("text-xl mb-8 max-w-2xl mx-auto")}>
                        Оставьте заявку и мы обсудим ваш проект
                    </p>
                    <Link
                        href="/contact"
                        className={cn(
                            "inline-block bg-white text-orange-600 dark:text-orange-800",
                            "px-8 py-3 rounded-full font-bold hover:bg-gray-100",
                            "transition-colors duration-200"
                        )}
                    >
                        Обсудить проект
                    </Link>
                </div>
            </section>
        </div>
    );
}