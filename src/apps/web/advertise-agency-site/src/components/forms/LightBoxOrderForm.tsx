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

const boxShapes = [
    { value: 'Rectangle', label: 'Прямоугольный' },
    { value: 'Round', label: 'Круглый' },
    { value: 'Custom', label: 'Индивидуальный' }
];

const illuminationTypes = [
    { value: 'Internal', label: 'Внутренняя подсветка' },
    { value: 'External', label: 'Внешняя подсветка' },
    { value: 'None', label: 'Без подсветки' }
];

interface FieldExplanationProps {
    activeField: string | null;
    formData: Record<string, string>;
}

const FieldExplanation: React.FC<FieldExplanationProps> = ({ activeField }) => {
    const getExplanation = (field: string) => {
        switch (field) {
            case 'boxShape':
                return 'Форма короба влияет на визуальное восприятие и стоимость.';
            case 'illuminationType':
                return 'Выберите тип подсветки, если она требуется.';
            case 'height':
                return 'Укажите высоту короба в сантиметрах.';
            case 'width':
                return 'Укажите ширину короба в сантиметрах.';
            case 'depth':
                return 'Укажите глубину (толщину) короба.';
            case 'address':
                return 'Введите полный адрес доставки.';
            case 'phone':
                return 'Укажите номер телефона для связи.';
            case 'name':
                return 'Введите имя заказчика.';
            default:
                return '';
        }
    };

    return (
        <div className={cn(
            "hidden md:block space-y-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl",
            "border border-gray-300 dark:border-gray-600"
        )}>
            <h3 className={cn("text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center")}>
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
    boxShape: string;
    illuminationType: string;
    height: string;
    width: string;
    depth: string;
    address: string;
    phone: string;
    name: string;
    [key: string]: string;
}

interface LightBoxOrderFormProps {
    title?: string;
}

const LightBoxOrderForm: React.FC<LightBoxOrderFormProps> = ({title}: LightBoxOrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        boxShape: 'Rectangle',
        illuminationType: 'Internal',
        height: '',
        width: '',
        depth: '',
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
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setActiveField(e.target.name);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    if (!hasMounted) return null;

    return (
        <div className={formCardClass}>
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4">{title || 'Заказ светового короба'}</h2>

                <form className="space-y-6">
                    <div className="space-y-6">
                        {/* Форма короба */}
                        <div>
                            <label htmlFor="boxShape" className={labelClass}>Форма короба</label>
                            <select
                                id="boxShape"
                                name="boxShape"
                                value={formData.boxShape}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                            >
                                {boxShapes.map((shape) => (
                                    <option key={shape.value} value={shape.value}>
                                        {shape.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Тип подсветки */}
                        <div>
                            <label htmlFor="illuminationType" className={labelClass}>Тип подсветки</label>
                            <select
                                id="illuminationType"
                                name="illuminationType"
                                value={formData.illuminationType}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={inputClass}
                            >
                                {illuminationTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Размеры */}
                        <div className="grid grid-cols-3 gap-4">
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
                            <div>
                                <label htmlFor="depth" className={labelClass}>Глубина (см)</label>
                                <input
                                    type="number"
                                    id="depth"
                                    name="depth"
                                    value={formData.depth}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={inputClass}
                                    placeholder="Введите глубину"
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

                        {/* Кнопка */}
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

            <div className="w-full">
                <FieldExplanation activeField={activeField} formData={formData} />
            </div>
        </div>
    );
};

export default LightBoxOrderForm;
