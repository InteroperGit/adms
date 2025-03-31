// components/MobileNav.tsx
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from "next/link"

export default function MobileNav({ navLinks }: { navLinks: { name: string; href: string }[] }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Bars3Icon className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="top">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-center">Меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Button
                            key={link.href}
                            asChild
                            variant="ghost"
                            className="justify-center"
                        >
                            <Link href={link.href}>
                                {link.name}
                            </Link>
                        </Button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}