import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { cn } from "@/libs/utils";
import React, {JSX} from "react";
import Link from "next/link";
import {ContactItem} from "@/types/contacts";

interface ContactElement {
    icon: React.ReactNode;
    hoverColor?: string;
    data: ContactItem;
}

interface ContactsProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    contacts: ContactItem[];
}

const contactsData: Record<string, { icon: React.ReactNode, hoverColor: string  }> = {
    "phone1": {
        icon: <PhoneIcon />,
        hoverColor: "hover:text-green-600",
    },
    "phone2": {
        icon: <PhoneIcon />,
        hoverColor: "hover:text-green-600",
    },
    "email": {
        icon: <EnvelopeIcon />,
        hoverColor: "hover:text-blue-600",
    },
    "address": {
        icon: <MapPinIcon />,
        hoverColor: "hover:text-red-600",
    },
}

const getContactElements = (contacts?: ContactItem[]): ContactElement[] => {
    if (!contacts) {
        return [];
    }

    return contacts.map((contact) => ({
        icon: contactsData[contact.slug]?.icon,
        hoverColor: contactsData[contact.slug]?.hoverColor,
        data: contact
    }))
}

/**
 * Компонент для отображения списка контактных элементов в футере.
 * Отображает контакты, такие как телефон, email и адрес, с соответствующими иконками и анимацией при наведении.
 * Если для контакта предоставлен URL, то при клике происходит переход по указанной ссылке.
 * Контакты могут быть отображены в виде ссылок или просто текста в зависимости от наличия URL.
 *
 * @param {ContactsProps} props - Свойства компонента.
 * @param {string} [props.className] - Дополнительные классы для кастомизации стилей компонента.
 * @param {string} [props.iconClassName] - Дополнительные классы для иконок.
 * @param {string} [props.textClassName] - Дополнительные классы для текста.
 * @param {ContactItem[]} props.contacts - Массив объектов с данными для каждого контакта (например, телефон, email, адрес).
 *
 * @returns {JSX.Element} - Разметка для списка контактов, с анимацией и ссылками на социальные сети или контакты.
 *
 * Пример использования:
 * <FooterContacts contacts={contactsData} />
 */
const FooterContacts = ({
                                           className,
                                           contacts,
                                       }: ContactsProps): JSX.Element => {
    const contactElements = getContactElements(contacts);

    return (
        <ul className={cn("space-y-2", className)}>
            {contactElements.map((contact, index) => (
                <li key={index}>
                    <Link
                        href={contact.data?.url || ""}
                        target={contact.data?.url?.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={cn(
                            "group flex items-start space-x-2",
                            "relative text-gray-700 dark:text-gray-300",
                            "hover:text-primary dark:hover:text-primary-400",
                            "transition-colors duration-200"
                        )}
                    >
                        <span
                            className={cn("h-5 w-5 text-gray-500 mt-0.5", contact.hoverColor)}
                        >
                          {contact.icon}
                        </span>
                        <span
                            className={cn(
                                "inline-block", // Сделаем span строчным элементом
                                "relative"
                            )}
                        >
                          {contact.data?.info}
                        <span
                            className={cn(
                                "absolute left-0 bottom-[-2px] h-[1px] w-0 bg-orange-500 dark:bg-orange-400",
                                "transition-all duration-300 group-hover:w-full"
                            )}
                        />
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default FooterContacts;
