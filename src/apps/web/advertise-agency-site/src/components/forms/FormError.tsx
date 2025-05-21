import {HTMLAttributes} from "react";
import {cn} from "@/libs/utils";

/**
 * Пропсы для компонента FormError.
 *
 * @property {string} [message] - Сообщение об ошибке, отображаемое в UI.
 * @property {string} [className] - Дополнительные CSS-классы для контейнера.
 * @extends HTMLAttributes<HTMLDivElement> - Поддержка стандартных HTML-атрибутов.
 */
interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
    message?: string;
}

/**
 * Компонент для отображения сообщения об ошибке формы.
 *
 * Возвращает `null`, если сообщение не передано.
 * Использует стили Tailwind для выделения ошибки.
 *
 * @param {FormErrorProps} props - Свойства компонента.
 * @returns {JSX.Element | null} Элемент ошибки или null.
 *
 * @example
 * <FormError message="Name is required" />
 */
export const FormError = ({message, className, ...props}: FormErrorProps) => {
    if (!message) {
        return null;
    }

    return (
        <div
            className={cn(
            "mt-2 text-sm rounded-lg bg-red-900/90 text-white px-3 py-1.5 shadow-md shadow-red-700/40",
            className
            )}
            {...props}
        >
            {message}
        </div>
    );
};