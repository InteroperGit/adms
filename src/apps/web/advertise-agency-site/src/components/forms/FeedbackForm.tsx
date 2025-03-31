"use client"

import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export default function FeedbackForm() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Оставить заявку</h2>

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

                <Button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-800">
                    Отправить запрос
                </Button>
            </form>
        </div>
    )
}