"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {MoonIcon, SunIcon} from "@heroicons/react/24/outline";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) return (
        <div className="w-9 h-9" /> // Placeholder для SSR
    )

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            {resolvedTheme === "dark" ? (
                <SunIcon style={{ height: '1.5rem', width: '1.5rem' }} />
            ) : (
                <MoonIcon style={{ height: '1.5rem', width: '1.5rem' }} />
            )}
        </button>
    )
}