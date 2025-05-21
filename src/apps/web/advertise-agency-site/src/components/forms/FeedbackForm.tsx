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
import {sendFormData} from "@/libs/api/formApi";
import {FormError} from "@/components/forms/FormError";
import {sendToastMessage} from "@/libs/message/toastUtils";

/**
 * Схема валидации для формы обратной связи.
 *
 * Использует Zod для проверки:
 * - Имя обязательно.
 * - Телефон должен быть корректным.
 * - Сообщение обязательно.
 *
 * @example
 * schema.parse({ name: "Alex", phone: "+79991234567", message: "Hi!" });
 */
const schema = z.object({
    name: z.string().min(1, "Имя обязательно для заполнения."),
    phone: z
        .string()
        .min(1, "Телефон обязателен для заполнения.")
        .regex(/^\+?\d[\d\s\-()]{7,}$/, "Введите корректный номер телефона."),
    message: z.string().min(1, "Пожалуйста, опишите ваш запрос."),
});

/**
 * Тип значений формы обратной связи, определённый по схеме валидации.
 *
 * Используется в типизации `react-hook-form`.
 *
 * @example
 * const form: FeedbackFormValues = {
 *   name: "Alex",
 *   phone: "+79991234567",
 *   message: "I'd like to know more about your service."
 * };
 */
type FeedbackFormValues = z.infer<typeof schema>;

/**
 * Компонент формы обратной связи с валидацией и отправкой данных.
 *
 * Форма использует `react-hook-form`, Zod и `sendFormData` для отправки
 * запроса на сервер. После успешной отправки отображается уведомление,
 * а форма сбрасывается.
 *
 * @returns {JSX.Element | null} Карточка с формой либо null, если не смонтирована.
 *
 * @example
 * <FeedbackForm />
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

    const onSubmit = async (values: FeedbackFormValues) => {
        try {
            await sendFormData({
                id: "feedback",
                ...values,
            });

            sendToastMessage("Ваша заявка успешно отправлена!", "success");
            reset();
        }
        catch (error) {
            sendToastMessage("Ошибка при отправке формы. Попробуйте снова.", "error");
            console.error("Failed to send feedback form data", error);
        }
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