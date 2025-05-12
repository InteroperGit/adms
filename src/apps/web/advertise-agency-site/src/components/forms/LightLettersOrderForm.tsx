"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/libs/utils';

const inputClass = cn(
    "w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900",
    "border-1 border-gray-900/30",
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

const lightingTypes = [
    { value: 'Lighted', label: 'Световые' },
    { value: 'Non-lighted', label: 'Несветовые' }
];

const letterColors = [
    { value: 'White', label: 'Белый' },
    { value: 'Red', label: 'Красный' },
    { value: 'Blue', label: 'Синий' },
    { value: 'Green', label: 'Зелёный' },
    { value: 'Yellow', label: 'Жёлтый' },
    { value: 'Black', label: 'Чёрный' },
    { value: 'Custom', label: 'Индивидуальный' }
];

interface FieldExplanationProps {
    activeField: string | null;
    formData: Record<string, string>;
}

const FieldExplanation: React.FC<FieldExplanationProps> = ({ activeField, formData }) => {
    const getExplanation = (field: string) => {
        switch (field) {
            case 'lightingType':
                return formData.lightingType === 'Lighted'
                    ? 'Выберите световые буквы, если они будут освещены изнутри.'
                    : 'Несветовые буквы не имеют внутреннего освещения.';
            case 'letterColor':
                return 'Выберите цвет букв для вашего заказа.';
            case 'height':
                return 'Укажите высоту букв в сантиметрах.';
            case 'width':
                return 'Укажите ширину букв в сантиметрах.';
            case 'address':
                return 'Введите полный адрес для доставки заказа.';
            case 'phone':
                return 'Укажите контактный телефон для связи.';
            case 'name':
                return 'Введите ваше имя для персонализации заказа.';
            default:
                return '';
        }
    };

    return (
        <div className={cn(
            "hidden md:block space-y-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl",
            "border border-gray-300 dark:border-gray-600"
        )}>
            <h3 className={cn(
                "text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center"
            )}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     className="w-5 h-5 mr-2 text-orange-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Пояснение
            </h3>
            <p className={cn(
                "text-lg text-gray-600 dark:text-gray-400 transition-opacity duration-300 opacity-100"
            )}>
                {activeField && getExplanation(activeField)}
            </p>
        </div>
    );
};

interface FormData {
    lightingType: string;
    letterColor: string;
    height: string;
    width: string;
    address: string;
    phone: string;
    name: string;
    [key: string]: string;  // Индексная сигнатура для любых строковых ключей
}

interface LightLettersOrderFormProps {
    title?: string;
}

/**
 * LightLettersOrderForm — форма для оформления заказа световых букв с выбором параметров.
 * Этот компонент позволяет пользователю указать все параметры для заказа световых букв,
 * включая тип освещения, цвет букв, размеры (высота и ширина), адрес, телефон и имя заказчика.
 * Форма адаптивна и использует хуки состояния для управления введёнными данными.
 *
 * Основные особенности:
 * 1. Пользователь может выбрать тип освещения и цвет букв из выпадающих списков.
 * 2. Размеры (высота и ширина) вводятся вручную через поля ввода.
 * 3. Используется компонент `FieldExplanation`, который отображает пояснения для каждого поля формы.
 * 4. Форма использует стилизацию с использованием Tailwind CSS для адаптивного дизайна.
 * 5. Для каждого поля предусмотрены обработчики событий, такие как `onChange`, `onFocus` и `onBlur`,
 * чтобы управлять состоянием данных и отображать пояснения.
 * 6. После отправки формы данные можно обработать для дальнейших действий.
 *
 * Этот компонент идеально подходит для сайтов, предлагающих услуги по производству и заказу световых букв.
 */
const LightLettersOrderForm: React.FC<LightLettersOrderFormProps> = ({title}: LightLettersOrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        lightingType: 'Lighted',
        letterColor: 'White',
        height: '',
        width: '',
        address: '',
        phone: '',
        name: '',
    });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setActiveField(e.target.name);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    if (!hasMounted) {
        return null;  // Пока компонент не смонтирован, не рендерим ничего
    }

    return (
        <div className={formCardClass}>
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4">{title || 'Заказ световых букв'}</h2>

                <form className="space-y-6">
                    {/* Левая часть формы: Поля ввода */}
                    <div className="space-y-6">
                        {/* Тип освещения */}
                        <div>
                            <label htmlFor="lightingType" className={labelClass}>Тип освещения</label>
                            <select
                                id="lightingType"
                                name="lightingType"
                                value={formData.lightingType}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                            >
                                {lightingTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Цвет букв */}
                        <div>
                            <label htmlFor="letterColor" className={labelClass}>Цвет букв</label>
                            <select
                                id="letterColor"
                                name="letterColor"
                                value={formData.letterColor}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                            >
                                {letterColors.map((color) => (
                                    <option key={color.value} value={color.value}>
                                        {color.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Размеры */}
                        <div className="grid grid-cols-2 gap-6">
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
                                    placeholder="Введите высоту"
                                />
                            </div>
                            <div>
                                <label htmlFor="width" className={labelClass}>Ширина (см)</label>
                                <input
                                    type="number"
                                    id="width"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={inputClass}
                                    placeholder="Введите ширину"
                                />
                            </div>
                        </div>

                        {/* Адрес */}
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
                                placeholder="Введите адрес"
                            />
                        </div>

                        {/* Телефон */}
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
                                placeholder="Введите телефон"
                            />
                        </div>

                        {/* Имя */}
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
                                placeholder="Введите ваше имя"
                            />
                        </div>

                        {/* Кнопка отправки формы */}
                        <div>
                            <button
                                type="submit"
                                className={buttonClass}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Пояснение */}
            <div className="w-full">
                <FieldExplanation activeField={activeField} formData={formData} />
            </div>
        </div>
    );
};

export default LightLettersOrderForm;
