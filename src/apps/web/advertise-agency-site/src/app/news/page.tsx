"use client"

import { ArticleCard } from '@/components/cards/ArticleCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon, CalendarIcon, FilterIcon } from 'lucide-react'
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import HeroSection from "@/components/sections/HeroSection";

const newsArticles = [
    {
        id: '1',
        title: 'Запуск новой линии широкоформатной печати',
        excerpt: 'Наше производство пополнилось новым оборудованием для печати баннеров до 5 метров шириной...',
        category: 'Производство',
        date: '15.06.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '2',
        title: 'Новые экологичные материалы для наружной рекламы',
        excerpt: 'Мы начали использовать биоразлагаемые пленки и чернила на водной основе...',
        category: 'Экология',
        date: '20.06.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '3',
        title: 'Как выбрать идеальный шрифт для рекламного баннера',
        excerpt: 'Выбор шрифта влияет на читаемость и восприятие рекламы. Мы собрали рекомендации экспертов...',
        category: 'Дизайн',
        date: '25.06.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1514899720986-38b7a1ba8ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '4',
        title: 'Тренды наружной рекламы 2024 года',
        excerpt: 'Какие технологии и стили будут популярны в этом году? Разбираем главные тенденции...',
        category: 'Маркетинг',
        date: '30.06.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '5',
        title: 'Современные технологии световых букв',
        excerpt: 'LED, неон и акрил – какие материалы использовать для создания эффектной вывески...',
        category: 'Технологии',
        date: '05.07.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '6',
        title: 'Как правильно ухаживать за рекламными конструкциями',
        excerpt: 'Своевременный уход за вывесками продлевает их срок службы и сохраняет внешний вид...',
        category: 'Обслуживание',
        date: '10.07.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '7',
        title: 'Как цифровая печать изменила рынок наружной рекламы',
        excerpt: 'От аналоговой печати к цифровым технологиям – преимущества и перспективы развития...',
        category: 'Производство',
        date: '15.07.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '8',
        title: 'Ошибки при проектировании рекламных конструкций',
        excerpt: 'Разбираем распространенные ошибки и даем советы по их предотвращению...',
        category: 'Конструирование',
        date: '20.07.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1570528561537-466ade512b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '9',
        title: 'Выставочные стенды: как привлечь внимание посетителей',
        excerpt: 'Эффективные решения для дизайна стендов и секреты успешного представления бренда...',
        category: 'Выставки',
        date: '25.07.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1572025448129-32f7c3e8cc12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '10',
        title: 'Как выбрать оптимальное освещение для наружной рекламы',
        excerpt: 'LED, неон или прожекторы? Разбираем плюсы и минусы разных вариантов...',
        category: 'Освещение',
        date: '30.07.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

export default function NewsPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Новости' }
        ])
    }, []);

    return (
        <>
            {/* Шапка страницы */}
            <HeroSection
                title={"Новости компании"}
                description={"Следите за нашими последними достижениями и обновлениями"}
            />

            {/* Панель управления */}
            <div className="my-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Поиск по новостям..."
                        className="pl-10 pr-4 py-6 text-base"
                    />
                </div>
            </div>

            {/* Основной контент */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {newsArticles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        priority={index < 3}
                        basePath="/news"
                    />
                ))}
            </div>

            {/* Блок подписки */}
            <div className="bg-secondary rounded-xl p-8 text-center mb-12">
                <h2 className="text-2xl font-bold mb-2">Будьте в курсе новостей</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Подпишитесь на нашу рассылку, чтобы первыми получать важные обновления
                </p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Ваш email"
                        className="py-6 flex-1"
                    />
                    <Button className="py-6 px-8">Подписаться</Button>
                </div>
            </div>

            {/* Пагинация */}
            <div className="flex justify-center gap-2">
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
        </>
    )
}