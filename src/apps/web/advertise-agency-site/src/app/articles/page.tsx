"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import HeroSection from "@/components/sections/HeroSection";
import {ArticlePreviewCard} from "@/components/cards/ArticlePreviewCard";
import {useEffect, useState} from "react";
import {getAllArticles} from "@/libs/api/articles";
import {Article} from "@/types/article";
import {Skeleton} from "@/components/ui/skeleton";

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllArticles()
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка загрузки статей:', error);
                setLoading(false);
            })
    }, [])

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
                {loading ? (
                    // Если данные еще загружаются, показываем скелетоны
                    Array(6)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index} className="space-y-4">
                                <Skeleton className="h-6 w-3/4" /> {/* Заголовок */}
                                <Skeleton className="h-4 w-full" /> {/* Описание */}
                                <Skeleton className="h-4 w-1/2" /> {/* Другие элементы */}
                            </div>
                        ))
                ) : (
                    // Если данные загружены, показываем статьи
                    articles.map((article, index) => (
                        <ArticlePreviewCard
                            key={article.id}
                            article={article}
                            priority={index < 3} // Приоритет для первых 3 изображений
                        />
                    ))
                )}
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