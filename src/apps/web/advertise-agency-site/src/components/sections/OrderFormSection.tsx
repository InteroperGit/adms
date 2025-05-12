import React, {JSX} from "react";
import { cn } from "@/libs/utils";

interface OrderFormSectionProps {
    className?: string;
}

/**
 * OrderFormSection — компонент, который отображает форму для отправки заявки.
 * Включает в себя поля для ввода имени и телефона, а также кнопку отправки.
 * Компонент использует подкомпоненты для поля ввода (InputField) и кнопки отправки (SubmitButton),
 * что повышает читаемость и упрощает поддержку кода.
 */
const OrderFormSection: React.FC<OrderFormSectionProps> = ({ className }: OrderFormSectionProps): JSX.Element => {
    return (
        <div className={cn(`${className}`)}>
            <h2 className={cn("text-2xl font-bold mb-4 dark:text-white")}>Оставить заявку</h2>
            <form className={cn("space-y-4")}>
                <div>
                    <input
                        type="text"
                        placeholder="Ваше имя"
                        className={cn("w-full p-3 rounded border bg-white dark:bg-gray-700 dark:border-gray-600  dark:text-white dark:placeholder-gray-400")}
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        placeholder="Телефон"
                        className={cn("w-full p-3 rounded border  bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400")}
                    />
                </div>
                <button
                    type="submit"
                    className={cn("w-full bg-orange-600 dark:bg-orange-700 text-white py-3 rounded font-bold hover:bg-orange-700 dark:hover:bg-orange-800 transition")}
                >
                    Отправить
                </button>
            </form>
        </div>
    );
};

export default OrderFormSection;
