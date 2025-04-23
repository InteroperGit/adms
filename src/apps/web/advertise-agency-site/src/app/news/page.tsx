"use client"

import { ArticlePreviewCard } from '@/components/cards/ArticlePreviewCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import HeroSection from "@/components/sections/HeroSection";
import {newsArticles} from "@/data/newsData";

export default function NewsPage() {
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
                    <ArticlePreviewCard
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