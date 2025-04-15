import {ProjectPreview} from "@/types/project";
import {Article} from "@/types/article";

export const projectPreviews: ProjectPreview[] = [
    {
        id: 1,
        title: 'Брендирование кафе "Sunrise"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'Сеть кофеен Sunrise',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format',
        slug: 'case-sunrise-cafe-signage',
        description: 'Полный ребрендинг сети кофеен'
    },
    {
        id: 2,
        title: 'Вывеска для бутика "Elegance"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'Бутик Elegance',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format',
        slug: 'elegance-sign',
        description: 'Световая вывеска для fashion-бутика'
    },
    {
        id: 3,
        title: 'Каталог продукции "TechLogic"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'TechLogic',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format',
        slug: 'techlogic-catalog',
        description: 'Полиграфический каталог на 120 страниц'
    },
    {
        id: 4,
        title: 'Упаковка для косметики "PureLine"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'PureLine Cosmetics',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format',
        slug: 'pureline-packaging',
        description: 'Экологичная упаковка для косметики'
    },
    {
        id: 5,
        title: 'Брендбук "Global Finance"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'Global Finance',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format',
        slug: 'global-finance-brandbook',
        description: 'Разработка полного брендбука'
    },
    {
        id: 6,
        title: 'Билборды для автосалона "Premium Motors"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'Premium Motors',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format',
        slug: 'premium-motors-billboards',
        description: 'Серия билбордов для премиального автосалона'
    },
    {
        id: 7,
        title: 'Фирменные бланки "LegalTrust"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'LegalTrust',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format',
        slug: 'legaltrust-stationery',
        description: 'Разработка фирменных бланков для юридической компании'
    },
    {
        id: 8,
        title: 'Упаковка для чая "Mountain Leaf"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'Mountain Leaf',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?w=800&auto=format',
        slug: 'mountain-leaf-tea',
        description: 'Экологичная упаковка для премиального чая'
    },
    {
        id: 9,
        title: 'Логотип и айдентика "UrbanFit"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'UrbanFit Gym',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format',
        slug: 'urbanfit-branding',
        description: 'Разработка логотипа и фирменного стиля для фитнес-клуба'
    },
    {
        id: 10,
        title: 'Световая вывеска "Grand Hotel"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'Grand Hotel',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format',
        slug: 'grand-hotel-sign',
        description: 'Неоновая вывеска для отеля премиум-класса'
    },
    {
        id: 11,
        title: 'Визитки "Architect Studio"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'Architect Studio',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format',
        slug: 'architect-visit-cards',
        description: 'Минималистичные визитки для архитектурного бюро'
    },
    {
        id: 12,
        title: 'Упаковка для вина "Vineyard"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'Vineyard Estates',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format',
        slug: 'vineyard-wine',
        description: 'Дизайн упаковки для линейки премиальных вин'
    },
    {
        id: 13,
        title: 'Ребрендинг "CityBank"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'CityBank',
        year: '2021',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format',
        slug: 'citybank-rebranding',
        description: 'Полный ребрендинг банковской сети'
    },
    {
        id: 14,
        title: 'Рекламный щит "Summer Sale"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'MegaMall',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format',
        slug: 'megamall-billboard',
        description: 'Сезонная рекламная кампания для торгового центра'
    },
    {
        id: 15,
        title: 'Брошюра "HealthCare"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'HealthCare Clinic',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format',
        slug: 'healthcare-brochure',
        description: 'Информационная брошюра медицинского центра'
    },
    {
        id: 16,
        title: 'Упаковка для сладостей "SweetJoy"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'SweetJoy',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=800&auto=format',
        slug: 'sweetjoy-packaging',
        description: 'Яркая упаковка для кондитерских изделий'
    },
    {
        id: 17,
        title: 'Фирменный стиль "EcoFood"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'EcoFood Market',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format',
        slug: 'ecofood-branding',
        description: 'Разработка айдентики для сети органических продуктов'
    },
    {
        id: 18,
        title: 'Вывеска "Coffee Time"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'Coffee Time',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&auto=format',
        slug: 'coffee-time-sign',
        description: 'Неоновая вывеска для кофейни'
    },
    {
        id: 19,
        title: 'Календарь "Art Gallery"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'Modern Art Gallery',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&auto=format',
        slug: 'art-gallery-calendar',
        description: 'Арт-календарь с работами современных художников'
    },
    {
        id: 20,
        title: 'Упаковка для парфюмерии "Luxury Scents"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'Luxury Scents',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format',
        slug: 'luxury-scents-packaging',
        description: 'Роскошная упаковка для нишевой парфюмерии'
    },
    {
        id: 21,
        title: 'Логотип "TechStart"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'TechStart',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
        slug: 'techstart-logo',
        description: 'Современный логотип для IT-стартапа'
    },
    {
        id: 22,
        title: 'Рекламный стенд "AutoExpo"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'AutoExpo',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format',
        slug: 'autoexpo-stand',
        description: 'Дизайн и производство рекламного стенда для автосалона'
    },
    {
        id: 23,
        title: 'Флаеры "NightClub"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'Pulse NightClub',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?w=800&auto=format',
        slug: 'nightclub-flyers',
        description: 'Яркие флаеры для ночного клуба'
    },
    {
        id: 24,
        title: 'Упаковка для кофе "Morning Brew"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'Morning Brew',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&auto=format',
        slug: 'morning-brew-coffee',
        description: 'Дизайн упаковки для зернового кофе'
    },
    {
        id: 25,
        title: 'Айдентика "FitnessPro"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'FitnessPro',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format',
        slug: 'fitnesspro-branding',
        description: 'Фирменный стиль для сети фитнес-центров'
    },
    {
        id: 26,
        title: 'Баннеры "Summer Festival"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'City Events',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format',
        slug: 'summer-festival-banners',
        description: 'Серия баннеров для городского фестиваля'
    },
    {
        id: 27,
        title: 'Буклет "Dental Care"',
        category: {
            id: 3,
            name: 'printing',
            title: "Печать"
        },
        client: 'Dental Care Clinic',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format',
        slug: 'dental-care-booklet',
        description: 'Информационный буклет стоматологической клиники'
    },
    {
        id: 28,
        title: 'Упаковка для чая "Green Valley"',
        category: {
            id: 4,
            name: 'packaging',
            title: "Упаковка"
        },
        client: 'Green Valley',
        year: '2022',
        imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format',
        slug: 'green-valley-tea',
        description: 'Эко-упаковка для органического чая'
    },
    {
        id: 29,
        title: 'Логотип "Law Partners"',
        category: {
            id: 1,
            name: 'branding',
            title: "Брендирование"
        },
        client: 'Law Partners',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format',
        slug: 'law-partners-logo',
        description: 'Логотип для юридической фирмы'
    },
    {
        id: 30,
        title: 'Вывеска "BookStore"',
        category: {
            id: 2,
            name: 'outdoor',
            title: "Наружная реклама"
        },
        client: 'BookStore',
        year: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format',
        slug: 'bookstore-sign',
        description: 'Книжная вывеска для магазина'
    }
];

export const recentProjectPreviews: ProjectPreview[] = projectPreviews.slice(0, 6);

export const projects: Article[] = [{
    id: 1,
    title: "Кейс: как световая вывеска увеличила поток гостей кафе на 30%",
    description: "Реальный пример того, как качественная наружная реклама помогла кафе Sunrise увеличить вечернюю посещаемость на 30% и повысить узнаваемость бренда.",
    createdAt: "2023-10-15",
    updatedAt: "2023-11-20",
    publishedAt: "2023-11-25",
    readingTime: 10, // Увеличено время чтения
    slug: "case-sunrise-cafe-signage",
    tags: ["наружная реклама", "световые буквы", "кейсы", "малый бизнес"],
    cover: {
        id: 1,
        alternativeText: "Световая вывеска кафе в вечернее время",
        width: 2070,
        height: 1380,
        formats: {
            small: {
                url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                width: 600,
                height: 400
            },
            medium: {
                url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                width: 1200,
                height: 800
            },
            large: {
                url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                width: 1800,
                height: 1200
            }
        }
    },
    category: {
        id: 1,
        name: "Кейсы",
        title: "Кейсы",
        slug: "cases"
    },
    author: {
        id: 1,
        name: "Алексей Петров",
        avatar: {
            id: 1,
            alternativeText: "Алексей Петров",
            width: 2070,
            height: 1380,
            formats: {
                small: {
                    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
                    width: 600,
                    height: 400
                },
                medium: {
                    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
                    width: 1200,
                    height: 800
                },
                large: {
                    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
                    width: 1800,
                    height: 1200
                }
            }
        },
        position: "Главный дизайнер"
    },
    blocks: [
        // 1. Добавлена фотография с итоговым результатом
        {
            type: "image",
            image: {
                id: 1,
                formats: {
                    small: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                        width: 400,
                        height: 267
                    },
                    medium: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        width: 800,
                        height: 534
                    },
                    large: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                        width: 1200,
                        height: 800
                    }
                },
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                height: 1000,
                width: 800,
                alternativeText: "Реклама на остановке общественного транспорта",
                caption: "Локализованный таргетинг повышает эффективность на 40%",
            },
            fullWidth: true
        },
        {
            type: "text",
            content: "<h2>Проблема: невидимость = потеря клиентов</h2><p>Кафе Sunrise расположено в оживленном районе, но его старая вывеска была практически незаметна в вечернее время.</p>"
        },
        {
            type: "image",
            image: {
                id: 1,
                formats: {
                    small: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                        width: 400,
                        height: 267
                    },
                    medium: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        width: 800,
                        height: 534
                    },
                    large: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                        width: 1200,
                        height: 800
                    }
                },
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                height: 1000,
                width: 800,
                alternativeText: "Реклама на остановке общественного транспорта",
                caption: "Локализованный таргетинг повышает эффективность на 40%",
            },
            fullWidth: true
        },
        {
            type: "text",
            content: "<h3>Основные недостатки старой вывески:</h3><ul><li>Плохая читаемость из-за мелкого шрифта</li><li>Отсутствие подсветки в вечернее время</li><li>Не выделялась на фоне соседних заведений</li></ul>"
        },
        {
            type: "divider",
            style: "dashed"
        },
        {
            type: "text",
            content: "<h2>Решение: световые буквы с теплой подсветкой</h2>"
        },
        {
            type: "imageGallery",
            images: [
                {
                    id: 1,
                    formats: {
                        small: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                            width: 400,
                            height: 267
                        },
                        medium: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            width: 800,
                            height: 534
                        },
                        large: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                            width: 1200,
                            height: 800
                        }
                    },
                    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    height: 1000,
                    width: 800,
                    alternativeText: "Реклама на остановке общественного транспорта",
                    caption: "Локализованный таргетинг повышает эффективность на 40%",
                },
                {
                    id: 2,
                    formats: {
                        small: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                            width: 400,
                            height: 267
                        },
                        medium: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            width: 800,
                            height: 534
                        },
                        large: {
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                            width: 1200,
                            height: 800
                        }
                    },
                    url: "https://images.unsplash.com/photo-1600711725407-2ea4733a38c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    height: 1000,
                    width: 800,
                    alternativeText: "Креативный рекламный постер",
                    caption: "Нестандартные форматы привлекают в 3 раза больше внимания",
                },
            ],
            layout: "grid",
            columns: 2
        },
        // 2. Добавлен раздел "Изготовление"
        {
            type: "text",
            content: "<h2>Изготовление вывески</h2><p>Процесс производства световых букв включал несколько этапов:</p>"
        },
        {
            type: "text",
            content: "<h3>1. Подготовка материалов</h3><p>Для основы букв использовался акриловый лист толщиной 8 мм, который устойчив к ультрафиолету и перепадам температур. Для подсветки выбрали энергоэффективные светодиодные ленты с теплым свечением (3000K).</p>"
        },
        {
            type: "image",
            image: {
                id: 1,
                formats: {
                    small: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                        width: 400,
                        height: 267
                    },
                    medium: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        width: 800,
                        height: 534
                    },
                    large: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                        width: 1200,
                        height: 800
                    }
                },
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                height: 1000,
                width: 800,
                alternativeText: "Реклама на остановке общественного транспорта",
                caption: "Локализованный таргетинг повышает эффективность на 40%",
            },
            fullWidth: false
        },
        {
            type: "text",
            content: "<h3>2. Лазерная резка</h3><p>Буквы были вырезаны на лазерном станке с высокой точностью (погрешность менее 0,1 мм). Это обеспечило идеальные формы и гладкие края.</p>"
        },
        {
            type: "text",
            content: "<h3>3. Монтаж подсветки</h3><p>Светодиодные ленты устанавливались с равномерным шагом 5 см для равномерного свечения без темных пятен. Все соединения были герметизированы.</p>"
        },
        {
            type: "image",
            image: {
                id: 1,
                formats: {
                    small: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                        width: 400,
                        height: 267
                    },
                    medium: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        width: 800,
                        height: 534
                    },
                    large: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                        width: 1200,
                        height: 800
                    }
                },
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                height: 1000,
                width: 800,
                alternativeText: "Реклама на остановке общественного транспорта",
                caption: "Локализованный таргетинг повышает эффективность на 40%",
            },
            fullWidth: false
        },
        // 3. Добавлен раздел "Согласование в архитектуре"
        {
            type: "text",
            content: "<h2>Согласование в архитектуре</h2><p>Размещение вывески потребовало согласования с городской архитектурной комиссией. Наши специалисты подготовили полный пакет документов:</p>"
        },
        {
            type: "text",
            content: "<ul><li>Технический паспорт вывески с расчетами нагрузок</li><li>3D-визуализацию в контексте здания</li><li>Схему крепления и электропроводки</li><li>Гарантийные обязательства</li></ul>"
        },
        {
            type: "text",
            content: "<p>Благодаря профессиональному подходу, согласование заняло всего 7 рабочих дней. Мы учли все требования по безопасности и эстетике городской среды.</p>"
        },
        {
            type: "image",
            image: {
                id: 1,
                formats: {
                    small: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                        width: 400,
                        height: 267
                    },
                    medium: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        width: 800,
                        height: 534
                    },
                    large: {
                        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                        width: 1200,
                        height: 800
                    }
                },
                url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                height: 1000,
                width: 800,
                alternativeText: "Реклама на остановке общественного транспорта",
                caption: "Локализованный таргетинг повышает эффективность на 40%",
            },
            fullWidth: true
        },
        {
            type: "quote",
            text: "Мы не ожидали такого эффекта! Теперь Sunrise видно издалека, а гости говорят: 'Мы вас нашли по вывеске'. Это лучшая инвестиция за последний год.",
            author: "Анна, владелец кафе Sunrise"
        },
        {
            type: "text",
            content: "<h2>Результаты после установки</h2>"
        },
        {
            type: "table",
            headers: ["Показатель", "Результат"],
            rows: [
                ["Рост вечерней посещаемости", "+30%"],
                ["Увеличение среднего чека", "+15%"],
                ["Гарантийный срок", "5 лет"],
                ["Срок согласования", "7 дней"]
            ],
            align: ["left", "center"]
        },
        {
            type: "video",
            url: "https://www.youtube.com/watch?v=example123",
            source: "youtube",
            caption: "Процесс монтажа вывески",
            aspectRatio: "16:9"
        },
        {
            type: "text",
            content: "<h2>Хотите такой же результат для своего бизнеса?</h2><p>Мы изготовим для вас вывеску, которая будет привлекать клиентов 24/7.</p>"
        },
        {
            type: "form",
            formType: "lightLetters",
            title: "Заказать световые буквы"
        }
    ],
    seo: {
        title: "Кейс: световая вывеска для кафе Sunrise | Увеличение потока на 30%",
        description: "Реальный пример увеличения посещаемости кафе на 30% после установки световой вывески. Подробный разбор проекта и результатов.",
        keywords: ["световые буквы", "наружная реклама", "вывеска для кафе", "кейс", "согласование вывески"],
        ogImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    isFeatured: true,
}];