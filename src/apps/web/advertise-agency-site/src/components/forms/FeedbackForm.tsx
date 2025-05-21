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
import {JSX, useEffect, useState, useRef} from "react";
import {FeedbackFormContent} from "@/types/forms/feedbackForm";
import {sendFormData} from "@/libs/api/formApi";

const onSubmitHandler = (data: FeedbackFormContent) => {
    sendFormData(data)
        .then(() => (console.log("Successfully sent feedback form data")))
        .catch(() => (console.error("Failed to send feedback form data")));
}

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

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    //const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const handleSubmit = () => {
        const name = nameRef.current?.value.trim() || "";
        const phone = phoneRef.current?.value.trim() || "";
        const message = messageRef.current?.value.trim() || "";

        if (!name || !phone || !message) {
            // Критичную валидацию можно дублировать здесь, если нужно
            return;
        }

        onSubmitHandler({
            id: "feedback",
            name,
            phone,
            message,
        });
    };

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
                            ref={nameRef}
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
                            required
                            ref={phoneRef}
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
                            ref={messageRef}
                        />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleSubmit} className="w-full md:w-auto">
                    Отправить запрос
                </Button>
            </CardFooter>
        </Card>
    )
}

export default FeedbackForm;