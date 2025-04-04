import {PhoneIcon, EnvelopeIcon, MapPinIcon} from "@heroicons/react/24/outline";
import {cn} from "@/libs/utils";
import YandexMap from "@/components/misc/YandexMap";
import React from "react";

interface ContactItem {
    icon: React.ReactNode;
    text: string;
    hoverColor?: string;
    href?: string;
}

interface ContactsProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    contacts?: ContactItem[];
}

const contacts_data = [
    {
        icon: <PhoneIcon/>,
        text: "+7 911 505 35 03",
        hoverColor: "hover:text-green-600",
        href: "tel:+79115053503"
    },
    {
        icon: <EnvelopeIcon/>,
        text: "info@rmaster35.ru",
        hoverColor: "hover:text-blue-600",
        href: "mailto:info@rmaster35.ru"
    },
    {
        icon: <MapPinIcon/>,
        text: "г. Череповец, ул. Металлургов, д. 9",
        hoverColor: "hover:text-red-600",
        href: "https://yandex.ru/maps/-/CDbQYNRg"
    }
];

export default function FooterContacts({
                                           className,
                                           contacts = contacts_data
                                       }: ContactsProps) {
    return (
        <>
            <ul className={cn("space-y-2", className)}>
                {contacts.map((contact, index) => (
                    <li key={index}>
                        <a
                            href={contact.href}
                            target={contact.href?.startsWith('http') ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="group flex items-start space-x-2"
                        >
                            <span className={cn(
                                "h-5 w-5 text-gray-500 mt-0.5",
                                contact.hoverColor
                            )}>
                              {contact.icon}
                            </span>
                            <span className={cn(
                                    "text-gray-600 dark:text-gray-400",
                                    "group-hover:underline",
                                    "group-hover:underline-offset-4",
                                )}>
                              {contact.text}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <YandexMap
                constructorId="8e9d4dd92e269a69df84774136ae2871466aa55b34f941cb126cfc03efab1fb8"
                height="400px"
            />
        </>
    );
}