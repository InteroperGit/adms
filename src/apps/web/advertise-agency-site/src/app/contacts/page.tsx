import YandexMap from "@/components/misc/YandexMap";
import ContactsCard from "@/components/cards/ContactsCard";
import FeedbackForm from "@/components/forms/FeedbackForm";
import PageHeader from "@/components/header/PageHeader";
import {JSX} from "react";
import {ContactItem} from "@/types/contacts";
import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";
import {getContacts} from "@/libs/api/contactsApi";

/**
 * Метод, который представляет страницу с контактной информацией и формой обратной связи
 * @constructor
 */
const ContactsPage = async (): Promise<JSX.Element> => {
    let contacts: ContactItem[];

    try {
        contacts = await getContacts();
    }
    catch (error) {
        console.error("Ошибка при получении данных с сервера:", error);
        return (
            <ServiceIsNotRespondedError />
        )
    }

    return (
        <>
            <PageHeader>Контакты</PageHeader>

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
                {/* Левая колонка - контактная информация */}
                <div className={"space-y-6"}>
                    <ContactsCard contacts={contacts} />

                    <YandexMap
                        constructorId="8e9d4dd92e269a69df84774136ae2871466aa55b34f941cb126cfc03efab1fb8"
                        height="400px"
                    />
                </div>

                {/* Форма обратной связи */}
                <FeedbackForm />
            </div>
        </>
    );
}

export default ContactsPage;