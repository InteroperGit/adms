"use client"

import Logo from "@/components/misc/Logo";
import Toolbar from "@/components/navigation/Toolbar";
import {HeaderContacts} from "@/components/header/HeaderContacts";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-26 items-center justify-between px-4 sm:px-6 lg:px-8">{/* Логотип с улучшенной стилизацией */}
                <Logo />
                <HeaderContacts
                    address="г. Череповец, ул. Металлургов, 9"
                    workHours="Пн–Пт: 09:00–18:00"
                    phone={"8 (8202) 603-503"}
                    email={"info@rmaster35.ru"}
                    className={"mr-5"}
                />
                <Toolbar />
            </div>
        </header>
    );
}