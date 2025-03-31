import Link from 'next/link';
import React from "react";

interface ServiceLink {
    name: string;
    href: string;
}

interface ServicesLinksProps {
    servicesLinks: ServiceLink[];
}

export default function FooterServicesLinks({ servicesLinks }: ServicesLinksProps): React.JSX.Element {
    return (
        <ul className="space-y-2">
            {servicesLinks.map((link) => (
                <li key={link.name}>
                    <Link href={link.href}
                          className={`text-gray-600 hover:text-gray-900 dark:text-gray-400 
                          dark:hover:text-white transition-colors hover:underline 
                          hover:underline-offset-4 hover:decoration-current`}>
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
