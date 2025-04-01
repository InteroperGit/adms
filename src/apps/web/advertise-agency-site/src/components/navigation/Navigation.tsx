"use client"

import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { usePathname } from "next/navigation"
import Toolbar from "@/components/navigation/Toolbar";
import {navLinks} from "@/config/navigation";

export default function Navigation() {
    const pathname = usePathname()

    return (
        <div className="border-b border-gray-200 dark:border-gray-800"> {/* Добавленная линия */}
            <div className="container mx-auto px-4">
                {/* Десктопное меню - выровнено по центру */}
                <nav className="hidden md:flex justify-center w-full py-4"> {/* Добавлен padding */}
                    <div className="flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Button
                                key={link.href}
                                asChild
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                className="hover:text-primary"
                            >
                                <Link href={link.href}>
                                    {link.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </nav>

                {/* Мобильная версия */}
                <Toolbar variant={"mobile"} />
            </div>
        </div>
    );
}