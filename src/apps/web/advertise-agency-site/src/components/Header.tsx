"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {ThemeToggle} from "@/components/buttons/theme-toggle";
import MobileNav from "@/components/MobileNav";
import { PhoneIcon } from "@heroicons/react/24/outline"
import { EnvelopeIcon } from "@heroicons/react/24/solid"
import Logo from "@/components/Logo";

const navLinks = [
    { name: "Услуги", href: "/services" },
    { name: "Портфолио", href: "/portfolio" },
    { name: "Контакты", href: "/contacts" }
]

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Логотип с улучшенной стилизацией */}
                <Logo />

                {/* Дополнительные элементы (можно добавить кнопки, переключатель темы и т.д.) */}
                <div className="flex items-center gap-1">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                    >
                        <Link href="/contact">
                            <PhoneIcon className="h-5 w-5" />
                            <span className="sr-only">Связаться с нами</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                    >
                        <Link href="/order">
                            <EnvelopeIcon className="h-5 w-5" />
                            <span className="sr-only">Оставить заявку</span>
                        </Link>
                    </Button>

                    {/* Кнопка темы */}
                    <ThemeToggle />

                    <MobileNav navLinks={navLinks} />
                </div>
            </div>
        </header>
    );
}