import {Article, ArticlePreview} from "@/types/article";

export const articlesPreviews: ArticlePreview[] = [
    {
        id: '1',
        slug: '1',
        title: 'Тренды в наружной рекламе 2024',
        excerpt: 'Обзор новых технологий и материалов для наружной рекламы в этом году.',
        category: 'Наружная реклама',
        date: '15.05.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Рекламные билборды
    },
    {
        id: '2',
        slug: '2',
        title: 'Как выбрать шрифты для брендинга',
        excerpt: 'Полное руководство по подбору шрифтовых пар для логотипов.',
        category: 'Брендинг',
        date: '10.05.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Шрифты
    },
    {
        id: '3',
        slug: '3',
        title: 'УФ-печать: преимущества и особенности',
        excerpt: 'Все что нужно знать о технологии УФ-печати.',
        category: 'Полиграфия',
        date: '05.05.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Печатная продукция
    },
    {
        id: '4',
        slug: '4',
        title: 'Нейромаркетинг в рекламе',
        excerpt: 'Как психологические приемы помогают увеличить конверсию.',
        category: 'Маркетинг',
        date: '28.04.2024',
        readTime: '8 мин',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Аналитика данных
    },
    {
        id: '5',
        slug: '5',
        title: 'Брендирование транспорта',
        excerpt: 'Как сделать мобильную рекламу эффективной.',
        category: 'Брендинг',
        date: '22.04.2024',
        readTime: '10 мин',
        imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Брендированный транспорт
    },
    {
        id: '6',
        slug: '6',
        title: 'Эффективные POS-материалы',
        excerpt: 'Какие рекламные материалы работают лучше всего.',
        category: 'Маркетинг',
        date: '18.04.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Торговое оборудование
    },
    {
        id: '7',
        slug: '7',
        title: '3D-вывески нового поколения',
        excerpt: 'Обзор современных технологий создания вывесок.',
        category: 'Наружная реклама',
        date: '12.04.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Неоновая вывеска
    },
    {
        id: '8',
        slug: '8',
        title: 'Эко-подход в полиграфии',
        excerpt: 'Как снизить экологический след при печати.',
        category: 'Полиграфия',
        date: '05.04.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Бумага и экология
    },
    {
        id: '9',
        slug: '9',
        title: 'Гайд по фирменным стилям 2024',
        excerpt: 'Анализ трендов в корпоративной айдентике.',
        category: 'Брендинг',
        date: '30.03.2024',
        readTime: '9 мин',
        imageUrl: 'https://images.unsplash.com/photo-1560869713-61ca42041df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Брендбук
    },
    {
        id: '10',
        slug: '10',
        title: 'Digital-инструменты для рекламы',
        excerpt: 'Как интегрировать цифровые технологии.',
        category: 'Маркетинг',
        date: '25.03.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Цифровые технологии
    }
];

export const articles: Article[] = [{
    id: '1',
    title: 'Наружная реклама в 2024 году: главные тренды и кейсы',
    excerpt: 'Разбираем ключевые тенденции наружной рекламы: от цифровых билбордов до экологичных решений. Примеры успешных кампаний и метрики эффективности.',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18',
    publishedAt: '2024-03-18',
    readingTime: 5,
    slug: '1',
    tags: ['реклама', 'OOH', 'digital', 'тренды'],

    coverImage: {
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        alt: 'Современный цифровой билборд в городской среде',
        width: 1200,
        height: 800
    },

    category: {
        name: 'Маркетинг',
        slug: 'marketing'
    },

    author: {
        name: 'Анна Смирнова',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        position: 'Главный редактор AdTrends'
    },

    isFeatured: true,
    isNew: true,

    content: [
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
            id: 'digital-billboards-2024',
            slug: 'digital-billboards-2024',
            title: 'Цифровые билборды: новые возможности',
            excerpt: 'Как технологии меняют рынок наружной рекламы',
            category: 'Технологии',
            date: '2024-02-10',
            readTime: '4 минуты',
            imageUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ar-advertising',
            slug: 'ar-in-outdoor-ads',
            title: 'AR в наружной рекламе: кейсы 2024',
            excerpt: 'Как дополненная реальность увеличивает вовлеченность',
            category: 'Инновации',
            date: '2024-01-28',
            readTime: '6 минут',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'eco-advertising',
            slug: 'sustainable-outdoor-ads',
            title: 'Эко-тренды в рекламе',
            excerpt: 'Зеленые технологии в OOH-кампаниях',
            category: 'Экология',
            date: '2023-12-15',
            readTime: '5 минут',
            imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
    ]
}]