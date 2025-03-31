import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PhoneIcon} from "@heroicons/react/24/outline";
import {EnvelopeIcon} from "@heroicons/react/24/solid";
import {ThemeToggle} from "@/components/buttons/theme-toggle";
import MobileNav from "@/components/MobileNav";
import {cn} from "@/lib/utils";
import React from "react";

const navLinks = [
    { name: "Услуги", href: "/services" },
    { name: "Портфолио", href: "/portfolio" },
    { name: "Контакты", href: "/contacts" }
]

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "desktop" | "mobile";
    className?: string;
}

export default function Toolbar({ variant = "desktop", className }: ToolbarProps) {
    return (
        <div className={cn(
                "flex",
                variant === "desktop"
                    ? "items-center gap-2 hidden sm:flex"
                    : "justify-between md:hidden",
                className)}>
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
    )
}