"use client"

import { ThemeProvider } from "next-themes";
import {BreadcrumbsProvider} from "@/contexts/breadcrumbs-context";
import React from "react";

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