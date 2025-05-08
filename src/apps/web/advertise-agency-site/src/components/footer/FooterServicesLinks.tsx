import Link from 'next/link';
import React from "react";
import { cn } from "@/libs/utils";
import {ServiceCategory} from "@/types/service";

// Подкласс для отображения каждого пункта с ссылкой
const ListItemLink = ({ href, title }: { href: string; title?: string }) => (
    <Link
        href={href}
        className={cn(
            "relative text-gray-700 dark:text-gray-300",
            "hover:text-primary dark:hover:text-primary-400",
            "transition-colors duration-200",
            "after:content-[''] after:absolute after:left-0 after:bottom-[-2] after:h-[1px]", // Высота подчеркивания
            "after:w-0 after:bg-orange-500 dark:after:bg-orange-400", // Цвет подчеркивания
            "after:transition-all after:duration-300 hover:after:w-full" // Анимация расширения
        )}
    >
        {title}
    </Link>
);

// Подкласс для отображения пункта без ссылки (как обычный текст)
const ListItemText = ({ title }: { title?: string }) => (
    <span
        className={cn(
            "font-medium block",
            "text-gray-900 dark:text-white",
            "cursor-default",
            "pb-1"
        )}
    >
    {title}
  </span>
);

// Подкласс для отображения подкатегорий с пунктами
const SubCategoryList = ({ items }: { items: { title?: string; href?: string }[] }) => (
    <ul className={cn("pl-5 space-y-2", "border-l-1 border-gray-400 dark:border-gray-700", "ml-2")}>
        {items.map((subItem, index) => (
            <li key={index}>
                {subItem.href ? (
                    <ListItemLink href={subItem.href} title={subItem?.title} />
                ) : (
                    <span className={cn("text-gray-600 hover:text-gray-900",
                        "dark:text-gray-400 dark:hover:text-white",
                        "transition-colors")}>
            {subItem.title}
          </span>
                )}
            </li>
        ))}
    </ul>
);

interface ServicesLinksProps {
    serviceCategories: ServiceCategory[];
    className?: string;
}

/**
 * Компонент для отображения списка ссылок на услуги в футере сайта.
 * Каждая категория услуг отображается с подкатегориями, если таковые есть.
 * Ссылки подкатегорий отображаются с анимацией подчеркивания при наведении.
 * Если ссылка на категорию или подкатегорию отсутствует, она отображается как обычный текст.
 *
 * @param {ServicesLinksProps} props - Свойства компонента.
 * @param {ServiceCategory[]} props.serviceCategories - Массив категорий услуг,
 * который должен быть отображен в футере. Каждая категория может содержать подкатегории.
 * @param {string} [props.className] - Дополнительные классы для кастомизации стилей компонента.
 *
 * @returns {React.JSX.Element} - Разметка для списка ссылок на услуги с возможными подкатегориями.
 *
 * Пример использования:
 * <FooterServicesLinks serviceCategories={categories} className="my-custom-class" />
 */
const FooterServicesLinks = ({
                                                serviceCategories,
                                                className
                                            }: ServicesLinksProps): React.JSX.Element => {
    return (
        <ul className={cn("space-y-4", className)}>
            {serviceCategories.map((service) => (
                <li key={service.name}>
                    <div className="mb-2">
                        {service.href ? (
                            <ListItemLink href={service.href} title={service.title} />
                        ) : (
                            <ListItemText title={service.title} />
                        )}
                    </div>

                    {/* Отображение подкатегорий, если они есть */}
                    {service.items && <SubCategoryList items={service.items} />}
                </li>
            ))}
        </ul>
    );
}

export default FooterServicesLinks;
