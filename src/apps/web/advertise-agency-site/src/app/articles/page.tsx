"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import HeroSection from "@/components/sections/HeroSection";
import {ArticlePreviewCard} from "@/components/cards/ArticlePreviewCard";
import {articlesPreviews} from "@/data/article-data";

export default function ArticlesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Статьи' }
        ])
    }, []);

    return (
        <div className="md:px-4">
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
                {articlesPreviews.map((article, index) => (
                    <ArticlePreviewCard
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