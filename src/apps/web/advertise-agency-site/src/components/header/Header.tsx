"use client"

import Logo from "@/components/misc/Logo";
import Toolbar from "@/components/navigation/Toolbar";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Логотип с улучшенной стилизацией */}
                <Logo />

                <Toolbar />
            </div>
        </header>
    );
}