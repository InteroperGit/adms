"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SubMenuItem } from "@/types/navigation"
import { cn } from "@/libs/utils"

interface Props {
    items: SubMenuItem[]
}

export const DesktopNavigationSubmenu: React.FC<Props> = ({ items }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3
            }}
            className={cn(
                "absolute top-full mx-auto left-0 right-0",
                "bg-white border-t shadow-md z-50",
                "rounded-b-2xl w-full max-w-[800px]" // <= контроль ширины
            )}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.1 }} // <= Появление содержимого после выезда
                className="flex justify-center px-6 py-6"
            >
                <div
                    className={cn(
                        "grid gap-6 w-full",
                        `grid-cols-${Math.min(items.length, 4)}`, // максимум 4 колонки
                    )}
                >
                    {items.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{col.title}</h4>
                            <hr className="border-t border-gray-200 mb-3" />
                            <ul className="space-y-1 text-sm">
                                {col.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "relative inline-block text-lg text-gray-700 transition-colors duration-200",
                                                "hover:text-orange-500",
                                                "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]",
                                                "after:w-0 after:bg-orange-500 after:transition-all after:duration-300",
                                                "hover:after:w-full"
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
