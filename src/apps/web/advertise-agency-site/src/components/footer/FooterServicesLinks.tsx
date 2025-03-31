import Link from 'next/link';
import React from "react";
import { cn } from "@/lib/utils";

interface ServiceItem {
    name: string;
    href?: string;
    subItems?: {
        name: string;
        href: string;
    }[];
}

interface ServicesLinksProps {
    servicesLinks: ServiceItem[];
    className?: string;
}

export default function FooterServicesLinks({
                                                servicesLinks,
                                                className
                                            }: ServicesLinksProps): React.JSX.Element {
    return (
        <ul className={cn("space-y-4", className)}> {/* Уменьшено с space-y-8 */}
            {servicesLinks.map((service) => (
                <li key={service.name}>
                    <div className="mb-2"> {/* Уменьшено с mb-4 */}
                        {service.href ? (
                            <Link
                                href={service.href}
                                className={cn(
                                    "font-medium block",
                                    "text-gray-900 hover:text-gray-600",
                                    "dark:text-white dark:hover:text-gray-300",
                                    "transition-colors",
                                    "hover:underline hover:underline-offset-4 hover:decoration-current",
                                    "pb-1"
                                )}
                            >
                                {service.name}
                            </Link>
                        ) : (
                            <span className={cn(
                                "font-medium block",
                                "text-gray-900 dark:text-white",
                                "hover:underline hover:underline-offset-4 hover:decoration-current",
                                "cursor-default",
                                "pb-1"
                            )}>
                                {service.name}
                            </span>
                        )}
                    </div>

                    {service.subItems && (
                        <ul className={cn(
                            "pl-5 space-y-2",
                            "border-l-1 border-gray-400 dark:border-gray-700",
                            "ml-2"
                            )}>
                            {service.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                    <Link
                                        href={subItem.href}
                                        className={cn(
                                            "text-gray-600 hover:text-gray-900",
                                            "dark:text-gray-400 dark:hover:text-white",
                                            "transition-colors",
                                            "hover:underline hover:underline-offset-4 hover:decoration-current"
                                        )}
                                    >
                                        - {subItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}