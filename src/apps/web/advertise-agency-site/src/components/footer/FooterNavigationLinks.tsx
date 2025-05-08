import Link from 'next/link';
import React, {JSX} from "react";
import {NavigationLink} from "@/types/navigation";
import {cn} from "@/libs/utils";

interface FooterNavigationLinksProps {
    navigationLinks: NavigationLink[];
}

export default function FooterNavigationLinks({ navigationLinks }: FooterNavigationLinksProps): JSX.Element {
    return (
        <ul className="space-y-2">
            {navigationLinks.map((link) => (
                <li key={link.name}>
                    <Link href={link.href || ""}
                          className={cn(
                              "relative text-gray-700 dark:text-gray-300",
                              "hover:text-primary dark:hover:text-primary-400",
                              "transition-colors duration-200",
                              "after:content-[''] after:absolute after:left-0 after:bottom-[-2] after:h-[1px]", // Высота подчеркивания
                              "after:w-0 after:bg-orange-500 dark:after:bg-orange-400", // Цвет подчеркивания
                              "after:transition-all after:duration-300 hover:after:w-full" // Анимация расширения
                          )}>
                        {link.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
