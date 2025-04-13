import {Article} from "@/types/article";

export const articles: Article[] = [{
    id: 1,
    title: 'Наружная реклама в 2024 году: главные тренды и кейсы',
    description: 'Разбираем ключевые тенденции наружной рекламы: от цифровых билбордов до экологичных решений. Примеры успешных кампаний и метрики эффективности.',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18',
    publishedAt: '2024-03-18',
    readingTime: 5,
    slug: '1',
    tags: ['реклама', 'OOH', 'digital', 'тренды'],

    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        alt: 'Современный цифровой билборд в городской среде',
        width: 1200,
        height: 800
    },

    category: {
        id: 1,
        name: 'narketing',
        title: 'Маркетинг',
        slug: 'marketing'
    },

    author: {
        id: 1,
        name: 'Анна Смирнова',
        avatar: {
            id: 1,
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            height: 1000,
            width: 800
        },
        position: 'Главный редактор AdTrends'
    },

    isFeatured: true,
    isNew: true,

    blocks: [
        {
            type: "text",
            content: "<p>В 2024 году наружная реклама переживает настоящую революцию. Традиционные билборды уступают место интеллектуальным digital-экранам, а экологичность становится must-have для брендов. Разберём ключевые изменения отрасли.</p>"
        },
        {
            type: "image",
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            alt: "Цифровой билборд в ночном городе",
            caption: "LED-экраны позволяют менять контент в реальном времени",
            fullWidth: true
        },
        {
            type: "text",
            content: "<h2>ТОП-3 тренда наружной рекламы</h2>"
        },
        {
            type: "text",
            content: `
                <ol>
                  <li><strong>Динамический контент</strong> - изменение сообщения в зависимости от времени суток, погоды или данных с датчиков</li>
                  <li><strong>Эко-материалы</strong> - 67% потребителей положительно оценивают "зелёную" рекламу</li>
                  <li><strong>Гибридные форматы</strong> - сочетание физических носителей с AR-технологиями</li>
                </ol>
            `
        },
        {
            type: "imageGallery",
            images: [
                {
                    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    alt: "Реклама на остановке общественного транспорта",
                    caption: "Локализованный таргетинг повышает эффективность на 40%"
                },
                {
                    url: "https://images.unsplash.com/photo-1600711725407-2ea4733a38c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    alt: "Креативный рекламный постер",
                    caption: "Нестандартные форматы привлекают в 3 раза больше внимания"
                }
            ],
            layout: "grid",
            columns: 2
        },
        {
            type: 'portfolio',
            projects: [
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
                    slug: 'sunrise-cafe',
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
            ]
        },
        {
            type: "quote",
            text: "К 2026 году доля цифровых носителей в OOH-рекламе достигнет 60%. Бренды, которые уже сейчас инвестируют в digital-форматы, получат значительное конкурентное преимущество.",
            author: "Максим Волков",
            source: "CEO OutdoorTech"
        },
        {
            type: "text",
            content: "<h2>Как измерить ROI?</h2>"
        },
        {
            type: "table",
            headers: ["Метрика", "Средний показатель", "Лучшие кейсы"],
            rows: [
                ["CTR QR-кодов", "3.8%", "До 12% у кампаний с gamification"],
                ["Brand recall", "58%", "82% у интерактивных инсталляций"],
                ["Стоимость контакта", "$0.15", "$0.03 у smart-билбордов"]
            ],
            align: ["left", "center", "center"]
        }
    ],

    seo: {
        title: "Тренды наружной рекламы 2024: полный гид",
        description: "Актуальные технологии и кейсы наружной рекламы. Как добиться максимальной эффективности OOH-кампаний в 2024 году.",
        keywords: ["наружная реклама", "OOH", "digital билборды", "рекламные тренды"]
    },

    relatedArticles: [
        {
            id: 1,
            slug: 'digital-billboards-2024',
            title: 'Цифровые билборды: новые возможности',
            description: 'Как технологии меняют рынок наружной рекламы',
            category: {
                id: 2,
                name: 'tech',
                title: 'Технологии',
                slug: 'tech'
            },
            publishedAt: '2024-02-10',
            readingTime: 4,
            coverImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }
        },
        {
            id: 2,
            slug: 'ar-in-outdoor-ads',
            title: 'AR в наружной рекламе: кейсы 2024',
            description: 'Как дополненная реальность увеличивает вовлеченность',
            category: {
                id: 3,
                name: 'innovations',
                title: 'Инновации',
                slug: 'innovations'
            },
            publishedAt: '2024-01-28',
            readingTime: 6,
            coverImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }
        },
        {
            id: 3,
            slug: 'sustainable-outdoor-ads',
            title: 'Эко-тренды в рекламе',
            description: 'Зеленые технологии в OOH-кампаниях',
            category: {
                id: 3,
                name: 'innovations',
                title: 'Инновации',
                slug: 'innovations'
            },
            publishedAt: '2024-01-28',
            readingTime: 6,
            coverImage: {
                id: 1,
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }
        }
    ]
}, {
    id: 2,
    slug: '1',
    title: 'Тренды в наружной рекламе 2024',
    description: 'Обзор новых технологий и материалов для наружной рекламы в этом году.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 3,
    slug: '2',
    title: 'Как выбрать шрифты для брендинга',
    description: 'Полное руководство по подбору шрифтовых пар для логотипов.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 4,
    slug: '3',
    title: 'УФ-печать: преимущества и особенности',
    description: 'Все что нужно знать о технологии УФ-печати.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 5,
    slug: '4',
    title: 'Нейромаркетинг в рекламе',
    description: 'Как психологические приемы помогают увеличить конверсию.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 6,
    slug: '5',
    title: 'Брендирование транспорта',
    description: 'Как сделать мобильную рекламу эффективной.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 7,
    slug: '6',
    title: 'Эффективные POS-материалы',
    description: 'Какие рекламные материалы работают лучше всего.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 8,
    slug: '7',
    title: '3D-вывески нового поколения',
    description: 'Обзор современных технологий создания вывесок.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 9,
    slug: '8',
    title: 'Эко-подход в полиграфии',
    description: 'Как снизить экологический след при печати.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 10,
    slug: '9',
    title: 'Гайд по фирменным стилям 2024',
    description: 'Анализ трендов в корпоративной айдентике.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1560869713-61ca42041df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}, {
    id: 11,
    slug: '10',
    title: 'Digital-инструменты для рекламы',
    description: 'Как интегрировать цифровые технологии.',
    category: {
        id: 1,
        name: 'outdoor',
        title: 'Наружная реклама',
        slug: 'outdoor'
    },
    publishedAt: '15.05.2024',
    readingTime: 5,
    coverImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
}]