"use client"

import React from "react"
import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { cn } from "@/libs/utils"

// Интерфейс пропсов компонента
interface HeaderContactsProps {
    address: string       // Адрес, который будет отображён
    workHours: string     // Время работы
    phone: string         // Телефон
    email: string         // Email
    className?: string    // Дополнительные классы
}

// Хелпер: кодирует адрес в URL для Яндекс.Карт
const getYandexMapsLink = (address: string) =>
    `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`

// Компонент с контактами для шапки
export const HeaderContacts: React.FC<HeaderContactsProps> = ({
                                                                  address,
                                                                  workHours,
                                                                  phone,
                                                                  email,
                                                                  className
                                                              }) => {
    return (
        <div
            className={cn(
                // Скрыт на sm, отображается в строку на больших экранах
                "hidden md:flex flex-row gap-12 text-lg text-gray-800 dark:text-gray-200",
                className
            )}
        >
            {/* Первый столбец: Адрес + часы */}
            <div className="hidden lg:flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <MapPin className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
                    {/* Адрес как ссылка на Яндекс.Карты с кастомным подчёркиванием */}
                    <a
                        href={getYandexMapsLink(address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leading-tight"
                    >
            <span className="border-b border-transparent hover:border-orange-500 pb-[2px] transition-colors">
              {address}
            </span>
                    </a>
                </div>
                <div className="flex items-start gap-2">
                    <Clock className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
                    <span className="leading-tight">{workHours}</span>
                </div>
            </div>

            {/* Второй столбец: Телефон + Email */}
            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <Phone className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
                    <a
                        href={`tel:${phone}`}
                        className="leading-tight"
                    >
            <span className="border-b border-transparent hover:border-orange-500 pb-[2px] transition-colors">
              {phone}
            </span>
                    </a>
                </div>
                <div className="flex items-start gap-2">
                    <Mail className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
                    <a
                        href={`mailto:${email}`}
                        className="leading-tight"
                    >
            <span className="border-b border-transparent hover:border-orange-500 pb-[2px] transition-colors">
              {email}
            </span>
                    </a>
                </div>
            </div>
        </div>
    )
}
