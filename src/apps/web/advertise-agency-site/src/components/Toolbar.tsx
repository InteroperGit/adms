import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PhoneIcon} from "@heroicons/react/24/outline";
import {ThemeToggle} from "@/components/buttons/theme-toggle";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import MobileNav from "@/components/navigation/MobileNav";
import {cn} from "@/lib/utils";
import React from "react";
import {navLinks} from "@/config/navigation";

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
                    : "w-full justify-between px-4 py-2 bg-background border-t md:hidden",
                className)}>
            {/* Позвонить */}
            <Button
                asChild
                variant="ghost"
                size={variant === "mobile" ? "default" : "sm"}
                className={variant === "mobile" ? "flex-1 flex-col gap-1 h-auto py-2" : ""}
            >
                <Link
                    href="tel:+79115053503"
                    className={cn("flex items-center", variant === "mobile" ? "flex-col" : "gap-2")}
                >
                    <PhoneIcon className="h-5 w-5" />
                    {variant === "mobile" && <span className="text-xs mt-1">Позвонить</span>}
                </Link>
            </Button>

            {/* WhatsApp */}
            <Button
                asChild
                variant="ghost"
                size={variant === "mobile" ? "default" : "sm"}
                className={variant === "mobile" ? "flex-1 flex-col gap-1 h-auto py-2" : ""}
            >
                <Link
                    href="https://wa.me/79115050635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center", variant === "mobile" ? "flex-col" : "gap-2")}
                >
                    <FaWhatsapp className="h-5 w-5 text-green-600 hover:text-green-700" />
                    {variant === "mobile" && <span className="text-xs mt-1">WhatsApp</span>}
                </Link>
            </Button>

            {/* Telegram */}
            <Button
                asChild
                variant="ghost"
                size={variant === "mobile" ? "default" : "sm"}
                className={variant === "mobile" ? "hidden" : ""}
            >
                <Link
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center", variant === "mobile" ? "flex-col" : "gap-2")}
                >
                    <FaTelegram className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                    {variant === "mobile" && <span className="text-xs mt-1">Telegram</span>}
                </Link>
            </Button>

            {/* Смена темы */}
            <div className={cn(
                "flex items-center",
                variant === "mobile" ? "hidden" : ""
            )}>
                <ThemeToggle />
            </div>

            {/* Мобильная навигация (только для mobile) */}
            {variant === "mobile" && (
                <div className="ml-4"> {/* Добавляем одинаковые отступы */}
                    <MobileNav navLinks={navLinks} />
                </div>
            )}
        </div>
    )
}