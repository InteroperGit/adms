import React from "react"
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
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

/**
 * HeaderContacts — компонент, который отображает контактную информацию в шапке сайта.
 * Он включает в себя адрес, время работы, телефон и email, с возможностью
 * перехода по этим данным с помощью ссылок.
 *
 * Основные особенности:
 * 1. Контактная информация отображается с иконками для каждого поля (адрес,
 * время работы, телефон, email), используя иконки из библиотеки `lucide-react`.
 * 2. Ссылки на адрес и телефон открываются в соответствующих приложениях или картах
 * (Яндекс.Карты для адреса и телефонный звонок для телефона).
 * 3. Используется адаптивный дизайн: на маленьких экранах компонент скрыт,
 * а на больших экранах информация отображается в строку.
 * 4. Добавлена анимация на ссылки, которая изменяет цвет при наведении
 * (с помощью `hover:border-orange-500`).
 * 5. Дополнительные стили и классы можно передать через `className`,
 * что позволяет легко кастомизировать внешний вид компонента.
 *
 * Этот компонент полезен для отображения контактной информации на сайте, особенно в шапке или футере.
 */
const HeaderContacts: React.FC<HeaderContactsProps> = ({
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
                    <MapPinIcon className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
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
                    <ClockIcon className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
                    <span className="leading-tight">{workHours}</span>
                </div>
            </div>

            {/* Второй столбец: Телефон + Email */}
            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <PhoneIcon className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
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
                    <EnvelopeIcon className="w-6 h-6 mt-0.5 text-orange-500 shrink-0" />
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

export default HeaderContacts;