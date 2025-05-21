"use client"

import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {JSX, useEffect, useState} from "react";
import {FeedbackFormContent} from "@/types/forms/feedbackForm";
import {sendFormData} from "@/libs/api/formApi";
import {FormError} from "@/components/forms/FormError";

const schema = z.object({
    name: z.string().min(1, "Имя обязательно для заполнения."),
    phone: z
        .string()
        .min(1, "Телефон обязателен для заполнения.")
        .regex(/^\+?\d[\d\s\-()]{7,}$/, "Введите корректный номер телефона."),
    message: z.string().min(1, "Пожалуйста, опишите ваш запрос."),
});

type FeedbackFormValues = z.infer<typeof schema>;

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
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(schema),
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSubmit = (values: FeedbackFormValues) => {
        onSubmitHandler({
            id: "feedback",
            ...values,
        });
        reset();
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Ваше имя
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Иван Иванов"
                            className="w-full"
                            {...register("name")}
                        />
                        {
                            errors.name
                                && <FormError message={errors.name?.message} />
                        }
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
                            {...register("phone")}
                        />
                        {
                            errors.phone
                            && <FormError message={errors.phone?.message} />
                        }
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
                            {...register("message")}
                        />
                        {
                            errors.message
                                && <FormError message={errors.message?.message} />
                        }
                    </div>

                    <div className="w-full md:w-auto flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="">
                            Отправить запрос
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default FeedbackForm;