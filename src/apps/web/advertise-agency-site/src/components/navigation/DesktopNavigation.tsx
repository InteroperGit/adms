"use client"

import React, {useRef, useState} from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/libs/utils"
import { DesktopNavigationSubmenu } from "@/components/navigation/DesktopNavigationSubmenu"
import {NavigationLink} from "@/types/navigation";

const SUBMENU_SHOW_HIDE_IDLE = 250

interface DesktopNavigationProps {
    navLinks: NavigationLink[]
}

export default function DesktopNavigation({ navLinks }: DesktopNavigationProps) {
    const pathname = usePathname()
    const [hoveredMenu, setHoveredMenu] = useState<NavigationLink | null>(null)

    const enterTimeout = useRef<NodeJS.Timeout | null>(null)
    const leaveTimeout = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = (link: NavigationLink) => {
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current)
        }

        enterTimeout.current = setTimeout(() => {
            setHoveredMenu(link)
        }, SUBMENU_SHOW_HIDE_IDLE)
    }

    const handleMouseLeave = () => {
        if (enterTimeout.current) {
            clearTimeout(enterTimeout.current)
        }

        leaveTimeout.current = setTimeout(() => {
            setHoveredMenu(null)
        }, SUBMENU_SHOW_HIDE_IDLE)
    }

    return (
        <div
            className={cn(
                "top-0 z-50 backdrop-blur-sm bg-background/80",
                "border-b border-gray-200 dark:border-gray-800"
            )}
        >
            <div className="container mx-auto px-4">
                {/* Оборачиваем всё в один контейнер для hover */}
                <div onMouseLeave={handleMouseLeave}
                     onMouseEnter={() => {
                        if (leaveTimeout.current) {
                            clearTimeout(leaveTimeout.current)
                        }
                }}>
                    <nav className="hidden md:flex justify-center w-full relative">
                        <div className="flex items-center gap-1 h-16">
                            {navLinks.map((link) => {
                                const href = link.href || "";
                                const isActive = pathname.startsWith(href)
                                return (
                                    <div
                                        key={link.name}
                                        className="relative"
                                        onMouseEnter={() => handleMouseEnter(link)}
                                    >
                                        <Link href={href || "#"} className="relative group">
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "px-4 py-2 text-lg font-medium transition-all",
                                                    "hover:text-primary hover:bg-accent/0",
                                                    isActive ? "text-primary" : "text-muted-foreground",
                                                    "relative overflow-hidden"
                                                )}
                                            >
                                                <span className="relative z-10">{link.title}</span>

                                                {isActive && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                        layoutId="activeIndicator"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Подменю — строго по центру */}
                    <AnimatePresence>
                        {hoveredMenu && hoveredMenu.links && hoveredMenu.links.length > 0 && (
                            <motion.div
                                key="submenu"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 w-screen"
                            >
                                <DesktopNavigationSubmenu links={hoveredMenu.links} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
