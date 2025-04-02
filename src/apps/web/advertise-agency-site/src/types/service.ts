import React from "react";

export interface ServiceCategory {
    icon: React.ReactNode
    title: string
    services: {
        name: string
        href: string
    }[]
}

export interface ServiceItem {
    name: string;
    href: string;
};

export interface SpecialServiceItem {
    title: string;
    description: string;
    features: ServiceItem[];
}

/**
 * Ссылка на услугу
 */
export interface ServiceLink {
    name: string,
    href: string,
    subItems?: ServiceItem[]
}