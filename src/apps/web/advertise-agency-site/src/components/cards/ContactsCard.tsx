import {
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import React, {JSX} from "react";
import {ContactItem} from "@/types/contacts";
import {cn} from "@/libs/utils";
import Link from "next/link";

interface ContactElement {
    icon: React.ReactNode;
    hoverColor: string;
    data: ContactItem;
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
    "workHours": {
        icon: <ClockIcon />,
        hoverColor: "hover:text-red-600",
    }
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

interface ContactCardProps {
    contacts: ContactItem[];
}

/**
 * Компонент карточки с контактной информацией, который отображает адрес, телефон и email.
 *
 * @returns {JSX.Element} - Разметка карточки с контактной информацией.
 *
 * Пример использования:
 * <ContactsCard />
 */
const ContactsCard = ({ contacts }: ContactCardProps): JSX.Element => {
    const contactElements = getContactElements(contacts);

    return (
        <Card>
            <CardTitle>
                Контактная информация
            </CardTitle>

            <CardContent>
                <ul className={"space-y-4"}>
                    {
                        contactElements.map((contact) => (
                            <li key={contact.data.id} className={"flex items-center gap-6"}>
                                <Link
                                    href={contact.data?.url || ""}
                                    target={contact.data?.url?.startsWith("http") ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "group flex items-end space-x-4", // Выравнивание по центру и увеличение расстояния между элементами
                                        "relative text-gray-700 dark:text-gray-300",
                                        "hover:text-primary dark:hover:text-primary-400",
                                        "transition-colors duration-200"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex-shrink-0", // Иконка не будет сжиматься
                                            "h-6 w-6",
                                            "mt-0.5 text-gray-500", // Убедитесь, что иконка будет в нужном размере
                                            contact.hoverColor, // Цвет при наведении, передается как класс
                                            "transition-colors duration-200" // Плавное изменение цвета
                                        )}
                                    >
                                      {contact.icon}
                                    </span>

                                    <span className="relative">
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
                        ))
                    }
                </ul>
            </CardContent>
        </Card>
    );
}

export default ContactsCard;