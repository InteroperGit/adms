import React from "react";
import { ThemeProvider } from "next-themes";
import {BreadcrumbsProvider} from "@/libs/providers/BreadcrumbsProvider";

export interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
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