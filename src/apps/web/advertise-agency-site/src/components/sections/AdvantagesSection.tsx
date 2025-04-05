import React from 'react';

interface AdvantageItem {
    title: string;
    desc: string;
}

interface AdvantagesSectionProps {
    className?: string;
    advantages?: AdvantageItem[];
}

const defaultAdvantages: AdvantageItem[] = [
    { title: "10+ лет опыта", desc: "На рынке рекламных услуг" },
    { title: "Собственное производство", desc: "Полный контроль качества" },
    { title: "500+ проектов", desc: "Успешно реализовано" }
];

const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({
                                                                 className = '',
                                                                 advantages = defaultAdvantages,
                                                             }) => {
    return (
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
            {advantages.map((item, index) => (
                <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {item.desc}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default AdvantagesSection;