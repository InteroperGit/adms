import {Article} from "@/types/article";

/**
 * Новости
 */
export const newsArticles: Article[] = [
    {
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
            name: "company",
            title: "Новости компании",
            slug: "light-letters",
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
                formType: "light-letters",
                title: "Заказать световые буквы"
            }
        ],
        seo: {
            title: "Кейс: световая вывеска для кафе Sunrise | Увеличение потока на 30%",
            description: "Реальный пример увеличения посещаемости кафе на 30% после установки световой вывески. Подробный разбор проекта и результатов.",
            ogImage: {
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
        },
        isFeatured: true,
    }
];