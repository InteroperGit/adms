"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { navLinks } from "@/config/navigation";
import { motion } from "framer-motion";
import { cn } from "@/libs/utils"; // Предполагается, что у вас есть утилита cn

export default function DesktopNavigation() {
    const pathname = usePathname();

    return (
        <div className={cn(
            "sticky top-0 z-50 backdrop-blur-sm bg-background/80",
            "border-b border-gray-200 dark:border-gray-800 shadow-sm"
        )}>
            <div className="container mx-auto px-4">
                <nav className="hidden md:flex justify-center w-full">
                    <div className="flex items-center gap-1 h-16">
                        {navLinks.map((link) => {
                            const isActive = pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative group" // Добавляем group для hover-эффектов
                                >
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-all",
                                            "hover:text-primary hover:bg-accent/50", // Плавные hover-эффекты
                                            isActive ? "text-primary font-semibold" : "text-muted-foreground",
                                            "relative overflow-hidden" // Для анимации
                                        )}
                                    >
                                        <span className="relative z-10">{link.name}</span>

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

                                        {/* Подчеркивание при hover */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/30"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}