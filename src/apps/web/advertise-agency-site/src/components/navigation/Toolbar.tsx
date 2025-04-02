import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PhoneIcon} from "@heroicons/react/24/outline";
import {ThemeToggle} from "@/components/buttons/ThemeToggle";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import {cn} from "@/lib/utils";
import React from "react";
import {navLinks} from "@/config/navigation";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export default function Toolbar({ className }: ToolbarProps) {
    return (
        <div className={cn(
                "flex",
                "items-center gap-2 hidden sm:flex",
                className)}>
            {/* Позвонить */}
            <Button
                asChild
                variant="ghost"
                size={"sm"}
            >
                <Link
                    href="tel:+79115053503"
                    className={cn("flex items-center", "gap-2")}
                >
                    <PhoneIcon className="h-5 w-5" />
                </Link>
            </Button>

            {/* WhatsApp */}
            <Button
                asChild
                variant="ghost"
                size={"sm"}
            >
                <Link
                    href="https://wa.me/79115050635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center", "gap-2")}
                >
                    <FaWhatsapp className="h-5 w-5 text-green-600 hover:text-green-700" />
                </Link>
            </Button>

            {/* Telegram */}
            <Button
                asChild
                variant="ghost"
                size={"sm"}
            >
                <Link
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center", "gap-2")}
                >
                    <FaTelegram className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                </Link>
            </Button>

            {/* Смена темы */}
            <div className={cn(
                "flex items-center",
            )}>
                <ThemeToggle />
            </div>
        </div>
    )
}