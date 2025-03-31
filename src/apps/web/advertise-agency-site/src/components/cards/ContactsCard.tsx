import {EnvelopeIcon, MapPinIcon, PhoneIcon} from "@heroicons/react/24/outline";

export default function ContactsCard() {
    return (
        <div className={"bg-white dark:bg-gray-800 rounded-lg shadow p-6"}>
            <h2 className={"text-xl font-semibold mb-4"}>Контактная информация</h2>

            <ul className={"space-y-4"}>
                <li className={"flex items-start gap-4"}>
                    <MapPinIcon className="h-6 w-6 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className={"font-medium"}>Адрес</h3>
                        <p className={"text-gray-600 dark:text-gray-400"}>
                            г. Череповец, ул. Металлургов, д. 9
                        </p>
                    </div>
                </li>

                <li className="flex items-start gap-4">
                    <PhoneIcon className="h-6 w-6 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium">Телефон</h3>
                        <a
                            href="tel:+79115053503"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            +7 (911) 505-35-03
                        </a>
                    </div>
                </li>

                <li className="flex items-start gap-4">
                    <EnvelopeIcon className="h-6 w-6 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium">Email</h3>
                        <a
                            href="mailto:info@rmaster35.ru"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            info@rmaster35.ru
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    );
}