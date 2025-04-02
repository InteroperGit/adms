import React from "react";

export type ServiceCategory = {
    icon: React.ReactNode
    title: string
    services: {
        name: string
        href: string
    }[]
}

export type ServiceItem = {
    name: string;
    href: string;
};

export type SpecialServiceItem = {
    title: string;
    description: string;
    features: ServiceItem[];
}

/**
 * Ссылка на услугу
 */
export type ServiceLink = {
    name: string,
    href: string,
    subItems?: ServiceItem[]
}