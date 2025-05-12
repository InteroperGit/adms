import Link from "next/link";
import { cn } from "@/libs/utils";
import React, {JSX} from "react";
import {SocialIcon} from "@/types/socialLink";

interface FooterSocialIconsProps {
    socialIcons: SocialIcon[];
    className?: string;
}

/**
 * FooterSocialIcons — компонент для отображения иконок социальных сетей в футере.
 * Он принимает массив объектов `socialIcons`, каждый из которых содержит информацию о ссылке, иконке и цвете.
 * С помощью компонента `Link` из библиотеки `next/link`, создается список иконок, который может быть использован для переходов по социальным сетям.
 *
 * Основные особенности:
 * 1. Компонент динамически рендерит иконки социальных сетей, используя данные из массива `socialIcons`.
 * 2. Каждая иконка обернута в ссылку `<Link>`, что позволяет использовать навигацию Next.js.
 * 3. Применяется множество классов для стилизации и анимации, включая эффект при наведении, изменение цвета для темной темы и плавные переходы.
 * 4. Иконки имеют дополнительные фокус-состояния для улучшения доступности.
 * 5. Дополнительный класс `className` может быть передан для кастомизации внешнего вида.
 *
 * Компонент полезен для футеров и других секций сайта, где необходимо отображать социальные иконки с эффектами при наведении.
 */
const FooterSocialIcons = ({ socialIcons, className }: FooterSocialIconsProps): JSX.Element => {
    return (
        <div className={cn("flex space-x-5", className)}>
            {socialIcons.map((social, index) => (
                <Link
                    key={index}
                    href={social.link?.url}
                    className={cn(
                        // Базовые стили
                        "p-2 rounded-full",
                        "text-gray-500 dark:text-gray-400",

                        // Эффекты при наведении
                        "hover:scale-110",
                        "hover:bg-opacity-10",
                        social.color,

                        // Темная тема
                        "dark:" + social.color,

                        // Анимация
                        "transition-all duration-300 ease-in-out",

                        // Фокус-состояния для доступности
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        "focus-visible:ring-current"
                    )}
                    aria-label={social.link?.title}
                >
                    {social.icon}
                </Link>
            ))}
        </div>
    );
}

export default FooterSocialIcons;