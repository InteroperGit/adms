"use client"

import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {JSX, useEffect, useState} from "react";

/**
 * FeedbackForm — форма для отправки заявки с полями для ввода имени, email, телефона, темы обращения и сообщения.
 * Компонент используется для сбора данных от пользователей, которые хотят оставить запрос или обратную связь.
 * Он включает в себя формы для ввода текстовых данных, такие как имя, email, телефон, тема обращения и сообщение.
 *
 * Основные особенности:
 * 1. Используются компоненты `Input` и `Textarea` для удобства ввода данных.
 * 2. Хук `useState` и `useEffect` применяются для отслеживания монтирования компонента, чтобы избежать ошибок с серверным рендерингом.
 * 3. Все поля формы, кроме телефона, являются обязательными для заполнения (через атрибут `required`).
 * 4. Взаимодействие с пользователем: при сабмите формы данные можно будет обработать.
 * 5. Используются компоненты UI, такие как `Card`, для красивого оформления формы.
 *
 * Этот компонент можно использовать на страницах обратной связи или на странице контактной формы сайта.
 */
const FeedbackForm = (): JSX.Element | null => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // или возвращайте скелетон/заглушку
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Оставить заявку</CardTitle>
            </CardHeader>

            <CardContent>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Ваше имя
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Иван Иванов"
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@mail.com"
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Телефон
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (XXX) XXX-XX-XX"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                            Тема обращения
                        </label>
                        <Input
                            id="subject"
                            type="text"
                            placeholder="Заказ наружной рекламы"
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                            Сообщение
                        </label>
                        <Textarea
                            id="message"
                            placeholder="Опишите ваш запрос..."
                            rows={5}
                            className="w-full"
                            required
                        />
                    </div>
                </form>
            </CardContent>

            <CardFooter className={"flex justify-end"}>
                <Button className="w-full md:w-auto">
                    Отправить запрос
                </Button>
            </CardFooter>
        </Card>
    )
}

export default FeedbackForm;