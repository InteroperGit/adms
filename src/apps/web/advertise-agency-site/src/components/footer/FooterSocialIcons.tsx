import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface SocialLink {
    icon: React.ReactNode;
    href: string;
    label: string;
    color: string;
}

interface FooterSocialIconsProps {
    socialLinks: SocialLink[];
    className?: string;
}

export default function FooterSocialIcons({ socialLinks, className }: FooterSocialIconsProps) {
    return (
        <div className={cn("flex space-x-5", className)}>
            {socialLinks.map((social, index) => (
                <Link
                    key={index}
                    href={social.href}
                    className={cn(
                        // Базовые стили
                        "p-2 rounded-full",
                        "text-gray-500 dark:text-gray-400",

                        // Эффекты при наведении
                        "hover:scale-110",
                        "hover:bg-opacity-10",
                        social.color,

                        // Темная тема
                        `dark:${social.color.replace('hover:', 'hover:dark:')}`,

                        // Анимация
                        "transition-all duration-300 ease-in-out",

                        // Фокус-состояния для доступности
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        "focus-visible:ring-current"
                    )}
                    aria-label={social.label}
                >
                    {social.icon}
                </Link>
            ))}
        </div>
    );
}