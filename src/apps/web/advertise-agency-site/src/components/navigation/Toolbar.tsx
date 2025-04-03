import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PhoneIcon} from "@heroicons/react/24/outline";
import {ThemeToggle} from "@/components/buttons/ThemeToggle";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import {cn} from "@/libs/utils";
import React from "react";
import {navLinks} from "@/config/navigation";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export default function Toolbar({ className }: ToolbarProps) {
    return (
        <div className={cn(
                "flex",
                "items-center gap-3 hidden sm:flex",
                className)}>
            {/* Позвонить */}
            <Button
                asChild
                variant="ghost"
                size={"lg"}
            >
                <Link
                    href="tel:+79115053503"
                >
                    <PhoneIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                </Link>
            </Button>

            {/* WhatsApp */}
            <Button
                asChild
                variant="ghost"
                size={"lg"}
            >
                <Link
                    href="https://wa.me/79115050635"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaWhatsapp
                        className="text-green-600 hover:text-green-700"
                        style={{ height: '1.5rem', width: '1.5rem' }}
                    />
                </Link>
            </Button>

            {/* Telegram */}
            <Button
                asChild
                variant="ghost"
                size={"lg"}
            >
                <Link
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaTelegram
                        className="text-blue-500 hover:text-blue-600"
                        style={{ height: '1.5rem', width: '1.5rem' }}
                    />
                </Link>
            </Button>

            {/* Смена темы */}
            <ThemeToggle />
        </div>
    )
}