import Link from "next/link";
import { cn } from "@/libs/utils";
import React from "react";
import {SocialIcon} from "@/types/socialLink";

interface FooterSocialIconsProps {
    socialIcons: SocialIcon[];
    className?: string;
}

export default function FooterSocialIcons({ socialIcons, className }: FooterSocialIconsProps) {
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