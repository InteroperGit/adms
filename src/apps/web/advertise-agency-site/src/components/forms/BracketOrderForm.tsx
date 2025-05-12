"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/libs/utils";

const inputClass = cn(
    "w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900",
    "border-1 border-gray-900/30"
);

const labelClass = "block text-sm font-medium mb-1";

const buttonClass = cn(
    "w-full py-2 px-4 bg-orange-500 text-white rounded-md",
    "hover:bg-orange-600 transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
);

const formCardClass = cn(
    "max-w-4xl w-full mx-auto p-6 rounded-xl shadow-md",
    "border border-gray-200 dark:border-gray-700",
    "grid grid-cols-1 md:grid-cols-2 gap-8"
);

interface FieldExplanationProps {
    activeField: string | null;
}

const FieldExplanation: React.FC<FieldExplanationProps> = ({ activeField }) => {
    const getExplanation = (field: string) => {
        switch (field) {
            case "length":
                return "Укажите длину вылета кронштейна в сантиметрах.";
            case "height":
                return "Укажите высоту кронштейна (если необходимо).";
            case "color":
                return "Цвет порошковой окраски или другого покрытия.";
            case "loadCapacity":
                return "Максимальная нагрузка (в кг), которую должен выдерживать кронштейн.";
            case "address":
                return "Адрес для доставки или установки кронштейна.";
            case "phone":
                return "Контактный номер телефона.";
            case "name":
                return "Имя или ФИО заказчика.";
            default:
                return "";
        }
    };

    return (
        <div className={cn(
            "hidden md:block space-y-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl",
            "border border-gray-300 dark:border-gray-600"
        )}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg"
                     className="w-5 h-5 mr-2 text-orange-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Пояснение
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 transition-opacity duration-300 opacity-100">
                {activeField && getExplanation(activeField)}
            </p>
        </div>
    );
};

interface FormData {
    length: string;
    height: string;
    color: string;
    loadCapacity: string;
    address: string;
    phone: string;
    name: string;
    [key: string]: string;
}

interface BracketOrderFormProps {
    title?: string;
}

/**
 * BracketOrderForm — форма для оформления заказа на кронштейн с несколькими полями ввода.
 * Компонент предоставляет форму для ввода информации о кронштейне, включая такие поля, как вылет, высота, цвет, нагрузка, адрес, телефон и имя заказчика.
 * Форма реализована с использованием состояния для отслеживания значений полей и активного поля (для отображения пояснений).
 *
 * Основные особенности:
 * 1. Для каждого поля формы используется отдельный компонент `<input>`, который обрабатывает изменение значений через `onChange`.
 * 2. Используются хуки `useState` и `useEffect` для управления состоянием формы и активного поля.
 * 3. При фокусировке на поле отображается пояснение к нему в компоненте `FieldExplanation`.
 * 4. При отправке формы данные собираются в объект `formData`.
 * 5. Компонент `FieldExplanation` отображает объяснение к текущему активному полю на основе его имени.
 * 6. Используется стилизация с Tailwind CSS для красивого и адаптивного дизайна формы.
 *
 * Компонент полезен для оформления заказов, где требуется ввод нескольких параметров товара и данных заказчика.
 */
const BracketOrderForm: React.FC<BracketOrderFormProps> = ({title}: BracketOrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        length: "",
        height: "",
        color: "",
        loadCapacity: "",
        address: "",
        phone: "",
        name: "",
    });

    const [activeField, setActiveField] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setActiveField(e.target.name);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    if (!hasMounted) return null;

    return (
        <div className={formCardClass}>
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4">{title || 'Заказ кронштейна'}</h2>

                <form className="space-y-6">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="length" className={labelClass}>Вылет (см)</label>
                            <input
                                type="number"
                                id="length"
                                name="length"
                                value={formData.length}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                                placeholder="Длина вылета"
                            />
                        </div>
                        <div>
                            <label htmlFor="height" className={labelClass}>Высота (см)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                                placeholder="Высота кронштейна"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="color" className={labelClass}>Цвет</label>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                                placeholder="Черный, белый и т.п."
                            />
                        </div>
                        <div>
                            <label htmlFor="loadCapacity" className={labelClass}>Нагрузка (кг)</label>
                            <input
                                type="number"
                                id="loadCapacity"
                                name="loadCapacity"
                                value={formData.loadCapacity}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                                placeholder="До 50 кг и т.п."
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className={labelClass}>Адрес</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="Адрес доставки"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className={labelClass}>Телефон</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="+7..."
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className={labelClass}>Имя</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="ФИО заказчика"
                        />
                    </div>

                    <div>
                        <button type="submit" className={buttonClass}>Отправить заказ</button>
                    </div>
                </form>
            </div>

            <div className="w-full">
                <FieldExplanation activeField={activeField} />
            </div>
        </div>
    );
};

export default BracketOrderForm;
