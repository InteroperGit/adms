// app/contacts/page.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import YandexMap from "@/components/misc/YandexMap";
import ContactsCard from "@/components/cards/ContactsCard";
import FeedbackForm from "@/components/forms/FeedbackForm";

export default function Contacts() {
    return (
        <div className={"container mx-auto px-4 py-12"}>
            <h1 className={"text-2xl font-bold text-center mb-12"}>Контакты</h1>

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
                {/* Левая колонка - контактная информация */}
                <div className={"space-y-6"}>
                    <ContactsCard />

                    <YandexMap
                        constructorId="8e9d4dd92e269a69df84774136ae2871466aa55b34f941cb126cfc03efab1fb8"
                        height="400px"
                    />
                </div>

                <FeedbackForm />
            </div>
        </div>
    );
}