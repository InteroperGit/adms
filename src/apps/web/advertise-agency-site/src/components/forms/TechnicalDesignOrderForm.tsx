"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/libs/utils";

const inputClass = cn(
    "w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900",
    "border-1 border-gray-900/30"
);

const labelClass = "block text-sm font-medium mb-1";

const textareaClass = cn(
    inputClass,
    "resize-vertical min-h-[100px]"
);

const buttonClass = cn(
    "w-full py-2 px-4 bg-blue-600 text-white rounded-md",
    "hover:bg-blue-700 transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
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
            case "objectType":
                return "Тип изделия: световой короб, буквы, фриз, баннер и т.д.";
            case "dimensions":
                return "Укажите ширину и высоту изделия в см или мм.";
            case "installationLocation":
                return "Описание места установки: фасад, крыша, козырёк, внутри ТЦ и т.д.";
            case "mounting":
                return "Как будет крепиться: на анкера, к стене, на столбы, на фасад — опиши подробно.";
            case "facadePhoto":
                return "Фото фасада (если есть) помогает лучше представить условия установки.";
            case "notes":
                return "Дополнительные пожелания или требования.";
            case "name":
                return "Имя или ФИО для связи.";
            case "phone":
                return "Номер телефона для связи.";
            case "email":
                return "Электронная почта (необязательно).";
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
                     className="w-5 h-5 mr-2 text-blue-600"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Подсказка
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 transition-opacity duration-300 opacity-100">
                {activeField && getExplanation(activeField)}
            </p>
        </div>
    );
};

interface FormData {
    objectType: string;
    dimensions: string;
    installationLocation: string;
    mounting: string;
    facadePhoto: string;
    notes: string;
    name: string;
    phone: string;
    email: string;
    [key: string]: string;
}

interface TechnicalDesignOrderFormProps {
    title?: string;
}

const TechnicalDesignOrderForm: React.FC<TechnicalDesignOrderFormProps> = ({title}: TechnicalDesignOrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        objectType: "",
        dimensions: "",
        installationLocation: "",
        mounting: "",
        facadePhoto: "",
        notes: "",
        name: "",
        phone: "",
        email: "",
    });

    const [activeField, setActiveField] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActiveField(e.target.name);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    if (!hasMounted) {
        return null;
    }

    return (
        <div className={formCardClass}>
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4">{title || 'Заказ технического проектирования'}</h2>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="objectType" className={labelClass}>Тип изделия</label>
                        <input
                            type="text"
                            id="objectType"
                            name="objectType"
                            value={formData.objectType}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="Например: световой короб"
                        />
                    </div>

                    <div>
                        <label htmlFor="dimensions" className={labelClass}>Размеры</label>
                        <input
                            type="text"
                            id="dimensions"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="ШхВ (в см или мм)"
                        />
                    </div>

                    <div>
                        <label htmlFor="installationLocation" className={labelClass}>Место установки</label>
                        <input
                            type="text"
                            id="installationLocation"
                            name="installationLocation"
                            value={formData.installationLocation}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="Фасад, крыша, козырёк и т.д."
                        />
                    </div>

                    <div>
                        <label htmlFor="mounting" className={labelClass}>Крепление</label>
                        <input
                            type="text"
                            id="mounting"
                            name="mounting"
                            value={formData.mounting}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="Как будет крепиться"
                        />
                    </div>

                    <div>
                        <label htmlFor="facadePhoto" className={labelClass}>Ссылка на фото фасада</label>
                        <input
                            type="text"
                            id="facadePhoto"
                            name="facadePhoto"
                            value={formData.facadePhoto}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="Google Drive, Telegram, и т.д."
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className={labelClass}>Дополнительно</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={textareaClass}
                            placeholder="Комментарий или пожелания"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder="Ваше имя"
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
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClass}
                            placeholder="example@mail.ru (необязательно)"
                        />
                    </div>

                    <div>
                        <button type="submit" className={buttonClass}>Отправить</button>
                    </div>
                </form>
            </div>

            <div className="w-full">
                <FieldExplanation activeField={activeField} />
            </div>
        </div>
    );
};

export default TechnicalDesignOrderForm;
