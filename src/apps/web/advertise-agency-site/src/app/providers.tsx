"use client"

import React from "react";
import { ThemeProvider } from "next-themes";
import {BreadcrumbsProvider} from "@/providers/BreadcrumbsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <BreadcrumbsProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </BreadcrumbsProvider>

    );
}