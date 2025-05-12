import { Button } from "@/components/ui/button"
import Link from "next/link"
import ThemeToggle from "@/components/buttons/ThemeToggle"
import { FaWhatsapp, FaTelegram } from "react-icons/fa"
import { cn } from "@/libs/utils"
import React, {JSX} from "react"

const iconSize = { height: "1.8rem", width: "1.8rem" }
const underlineClass = cn(
    "absolute bottom-0 left-0 w-full h-0.5",
    "bg-orange-600 scale-x-0 group-hover:scale-x-100",
    "transition-transform duration-300 origin-left"
)

// Подкомпонент для кнопки WhatsApp
const WhatsappButton: React.FC = (): JSX.Element => {
    return (
        <Button asChild variant="ghost" size="lg" className="hover:bg-0">
            <Link
                href="https://wa.me/79115050635"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
            >
                <FaWhatsapp className="text-green-600" style={iconSize} />
                <span className={underlineClass} />
            </Link>
        </Button>
    )
}

// Подкомпонент для кнопки Telegram
const TelegramButton: React.FC = (): JSX.Element => {
    return (
        <Button asChild variant="ghost" size="lg" className="hover:bg-0">
            <Link
                href="https://t.me/username"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
            >
                <FaTelegram className="text-blue-500" style={iconSize} />
                <span className={underlineClass} />
            </Link>
        </Button>
    )
}

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

/**
 * Toolbar — компонент, представляющий панель инструментов с кнопками для связи
 * через WhatsApp и Telegram, а также с переключателем темы. Кнопки ведут по
 * внешним ссылкам для общения через мессенджеры, а переключатель темы позволяет
 * пользователю изменять внешний вид интерфейса.
 *
 * Основные особенности:
 * 1. Включает кнопки для WhatsApp и Telegram с соответствующими иконками и
 *    ссылками на внешние страницы.
 * 2. Поддерживает анимацию для кнопок с помощью `group` и эффектов при наведении.
 * 3. Включает компонент для смены темы, который изменяет внешний вид страницы.
 *
 * Этот компонент полезен для создания панели инструментов, где пользователи
 * могут быстро обратиться через мессенджеры и изменить интерфейс сайта.
 */
const Toolbar: React.FC<ToolbarProps> = ({ className }: ToolbarProps): JSX.Element => {
    return (
        <div className={cn("flex items-center gap-5 hidden md:flex", className)}>
            {/* Кнопка WhatsApp */}
            <WhatsappButton />

            {/* Кнопка Telegram */}
            <TelegramButton />

            {/* Смена темы */}
            <ThemeToggle />
        </div>
    )
}

export default Toolbar;
