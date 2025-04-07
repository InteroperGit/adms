import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PhoneIcon } from "@heroicons/react/24/outline"
import { ThemeToggle } from "@/components/buttons/ThemeToggle"
import { FaWhatsapp, FaTelegram } from "react-icons/fa"
import { cn } from "@/libs/utils"
import React from "react"

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export default function Toolbar({ className }: ToolbarProps) {
    const iconSize = { height: "1.8rem", width: "1.8rem" }
    const underlineClass = cn(
        "absolute bottom-0 left-0 w-full h-0.5",
        "bg-orange-600 scale-x-0 group-hover:scale-x-100",
        "transition-transform duration-300 origin-left"
    )

    return (
        <div
            className={cn(
                "flex items-center gap-5 hidden md:flex",
                className
            )}
        >
            {/* WhatsApp */}
            <Button
                asChild
                variant="ghost"
                size="lg"
                className="hover:bg-0"
            >
                <Link
                    href="https://wa.me/79115050635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                >
                    <FaWhatsapp
                        className="text-green-600 "
                        style={iconSize}
                    />
                    <span className={underlineClass} />
                </Link>
            </Button>

            {/* Telegram */}
            <Button
                asChild
                variant="ghost"
                size="lg"
                className="hover:bg-0"
            >
                <Link
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                >
                    <FaTelegram
                        className="text-blue-500 "
                        style={iconSize}
                    />
                    <span className={underlineClass} />
                </Link>
            </Button>

            {/* Смена темы */}
            <ThemeToggle />
        </div>
    )
}
