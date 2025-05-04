import YandexMap from "@/components/misc/YandexMap";
import ContactsCard from "@/components/cards/ContactsCard";
import FeedbackForm from "@/components/forms/FeedbackForm";
import PageHeader from "@/components/header/PageHeader";

export default function ContactsPage() {
    return (
        <>
            <PageHeader>Контакты</PageHeader>

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
                {/* Левая колонка - контактная информация */}
                <div className={"space-y-6"}>
                    <ContactsCard />

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