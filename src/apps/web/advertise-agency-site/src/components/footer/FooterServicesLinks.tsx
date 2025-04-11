import Link from 'next/link';
import React from "react";
import { cn } from "@/libs/utils";
import { ServiceItem } from "@/types/service";

interface ServicesLinksProps {
    services: ServiceItem[];
    className?: string;
}

export default function FooterServicesLinks({
                                                services,
                                                className
                                            }: ServicesLinksProps): React.JSX.Element {
    return (
        <ul className={cn("space-y-4", className)}>
            {services.map((service) => (
                <li key={service.name}>
                    <div className="mb-2">
                        {service.href ? (
                            <Link
                                href={service.href}
                                className={cn(
                                    "relative text-gray-700 dark:text-gray-300",
                                    "hover:text-primary dark:hover:text-primary-400",
                                    "transition-colors duration-200",
                                    "after:content-[''] after:absolute after:left-0 after:bottom-[-2] after:h-[1px]", // Высота подчеркивания
                                    "after:w-0 after:bg-orange-500 dark:after:bg-orange-400", // Цвет подчеркивания
                                    "after:transition-all after:duration-300 hover:after:w-full" // Анимация расширения
                                )}
                            >
                                {service.title}
                            </Link>
                        ) : (
                            <span className={cn(
                                "font-medium block",
                                "text-gray-900 dark:text-white",
                                "cursor-default",
                                "pb-1"
                            )}>
                                {service.title}
                            </span>
                        )}
                    </div>

                    {service.items && (
                        <ul className={cn(
                            "pl-5 space-y-2",
                            "border-l-1 border-gray-400 dark:border-gray-700",
                            "ml-2"
                        )}>
                            {service.items.map((subItem) => (
                                <li key={subItem.name}>
                                    {
                                        subItem.href ? (
                                            <Link
                                                href={subItem.href}
                                                className={cn(
                                                    "relative text-gray-700 dark:text-gray-300",
                                                    "hover:text-primary dark:hover:text-primary-400",
                                                    "transition-colors duration-200",
                                                    "after:content-[''] after:absolute after:left-0 after:bottom-[-2] after:h-[1px]", // Высота подчеркивания
                                                    "after:w-0 after:bg-orange-500 dark:after:bg-orange-400", // Цвет подчеркивания
                                                    "after:transition-all after:duration-300 hover:after:w-full" // Анимация расширения
                                                )}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ) : (
                                            <span className={cn(
                                                "text-gray-600 hover:text-gray-900",
                                                "dark:text-gray-400 dark:hover:text-white",
                                                "transition-colors"
                                            )}>
                                                {subItem.title}
                                            </span>
                                        )
                                    }
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}
