"use client"

import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { cn } from "@/libs/utils"

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return <div className="w-9 h-9" /> // Placeholder для SSR
    }

    return (
        <button
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={cn(
                "p-1.5",
                "rounded-lg",
                "hover:bg-0 dark:hover:bg-0",
                "relative group",
                "focus:outline-none"
            )}
            aria-label="Переключить тему"
        >
            {/* Иконка переключения темы */}
            {resolvedTheme === "dark" ? (
                <SunIcon
                    style={{ height: "1.8rem", width: "1.8rem" }}
                />
            ) : (
                <MoonIcon
                    style={{ height: "1.8rem", width: "1.8rem" }}
                />
            )}

            {/* Подчеркивание при hover */}
            <motion.div
                className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5",
                    "bg-orange-600 scale-x-0 group-hover:scale-x-100",
                    "transition-transform duration-300 origin-left"
                )}
            />
        </button>
    )
}
