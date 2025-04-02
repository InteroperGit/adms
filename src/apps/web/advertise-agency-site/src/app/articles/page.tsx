"use client"

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import HeroSection from "@/components/sections/HeroSection";
import {ArticleCard} from "@/components/cards/ArticleCard";

interface Article {
    id: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    imageUrl: string
}

const articles: Article[] = [
    {
        id: '1',
        title: 'Тренды в наружной рекламе 2024',
        excerpt: 'Обзор новых технологий и материалов для наружной рекламы в этом году.',
        category: 'Наружная реклама',
        date: '15.05.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Рекламные билборды
    },
    {
        id: '2',
        title: 'Как выбрать шрифты для брендинга',
        excerpt: 'Полное руководство по подбору шрифтовых пар для логотипов.',
        category: 'Брендинг',
        date: '10.05.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Шрифты
    },
    {
        id: '3',
        title: 'УФ-печать: преимущества и особенности',
        excerpt: 'Все что нужно знать о технологии УФ-печати.',
        category: 'Полиграфия',
        date: '05.05.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Печатная продукция
    },
    {
        id: '4',
        title: 'Нейромаркетинг в рекламе',
        excerpt: 'Как психологические приемы помогают увеличить конверсию.',
        category: 'Маркетинг',
        date: '28.04.2024',
        readTime: '8 мин',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Аналитика данных
    },
    {
        id: '5',
        title: 'Брендирование транспорта',
        excerpt: 'Как сделать мобильную рекламу эффективной.',
        category: 'Брендинг',
        date: '22.04.2024',
        readTime: '10 мин',
        imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Брендированный транспорт
    },
    {
        id: '6',
        title: 'Эффективные POS-материалы',
        excerpt: 'Какие рекламные материалы работают лучше всего.',
        category: 'Маркетинг',
        date: '18.04.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Торговое оборудование
    },
    {
        id: '7',
        title: '3D-вывески нового поколения',
        excerpt: 'Обзор современных технологий создания вывесок.',
        category: 'Наружная реклама',
        date: '12.04.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Неоновая вывеска
    },
    {
        id: '8',
        title: 'Эко-подход в полиграфии',
        excerpt: 'Как снизить экологический след при печати.',
        category: 'Полиграфия',
        date: '05.04.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Бумага и экология
    },
    {
        id: '9',
        title: 'Гайд по фирменным стилям 2024',
        excerpt: 'Анализ трендов в корпоративной айдентике.',
        category: 'Брендинг',
        date: '30.03.2024',
        readTime: '9 мин',
        imageUrl: 'https://images.unsplash.com/photo-1560869713-61ca42041df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Брендбук
    },
    {
        id: '10',
        title: 'Digital-инструменты для рекламы',
        excerpt: 'Как интегрировать цифровые технологии.',
        category: 'Маркетинг',
        date: '25.03.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Цифровые технологии
    }
];

export default function ArticlesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Статьи' }
        ])
    }, []);

    return (
        <div className="container md:px-4">
            {/* Заголовок и описание */}
            <HeroSection
                title={"Статьи и полезные материалы"}
                description={"Экспертные статьи о рекламе, брендинге и маркетинге для вашего бизнеса"}
            />

            {/* Панель поиска и фильтров */}
            <div className="my-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Поиск статей..."
                        className="pl-10 pr-4 py-6 text-base"
                    />
                </div>
            </div>

            {/* Список статей */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        priority={index < 3} // Приоритет для первых 3 изображений
                    />
                ))}
            </div>

            {/* Пагинация */}
            <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" size="icon">
                    1
                </Button>
                <Button variant="ghost" size="icon">
                    2
                </Button>
                <Button variant="ghost" size="icon">
                    3
                </Button>
                <Button variant="ghost" size="icon">
                    ...
                </Button>
            </div>
        </div>
    )
}