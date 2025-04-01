import React from "react";
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageHeader({ children, className }: PageHeaderProps): React.ReactNode {
    return (
        <h1 className={cn("text-2xl font-bold text-left mb-12", className)}>{children}</h1>
    );
}