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
import {useEffect, useState} from "react";

export default function FeedbackForm() {
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