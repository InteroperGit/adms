import {ServicesSection} from "@/components/sections/ServicesSection";
import {serviceCategories} from "@/data/services-data";
import {PortfolioSection} from "@/components/sections/PortfolioSection";
import {categories} from "@/data/categories-data";
import {recentProjects} from "@/data/projects-data";

export default function Home() {
    return (
        <div className="space-y-12 pb-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* 1. Hero Banner */}
            <div className="bg-blue-600 dark:bg-blue-800 text-white py-20 px-6 rounded-lg text-center">
                <h1 className="text-4xl font-bold mb-4">Рекламное агентство полного цикла</h1>
                <p className="text-xl mb-8">Создаем эффективные решения с 2010 года</p>
                <button className="bg-white dark:bg-blue-100 text-blue-600 dark:text-blue-800 px-8 py-3 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-blue-200 transition">
                    Бесплатная консультация
                </button>
            </div>

            {/* 3. Преимущества */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "10+ лет опыта", desc: "На рынке рекламных услуг" },
                    { title: "Собственное производство", desc: "Полный контроль качества" },
                    { title: "500+ проектов", desc: "Успешно реализовано" }
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* 4. Карусель спецпредложений */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Специальные предложения</h2>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-shrink-0 w-64 h-48 bg-white dark:bg-gray-700 rounded-lg shadow-sm dark:shadow-none flex items-center justify-center border dark:border-gray-600">
                            <span className="dark:text-gray-200">Акция {i}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. О компании */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">О компании</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="mb-4 dark:text-gray-300">Мы — креативное рекламное агентство с полным циклом производства.</p>
                        <ul className="space-y-2 dark:text-gray-300">
                            {['500+ проектов', '50+ постоянных клиентов', 'Собственное производство'].map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="dark:text-gray-300">[Фото производства]</span>
                    </div>
                </div>
            </div>

            {/* 6. Услуги */}
            <div className="bg-white dark:bg-gray-800 px-6 rounded-lg border dark:border-gray-700">
                <ServicesSection
                    title="Наши услуги"
                    services={serviceCategories}
                    columns={4}
                    className="my-9"
                />
            </div>

            {/* 7. Этапы работы */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Как мы работаем</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                        {num: '1', title: 'Заявка', desc: 'Оставляете запрос'},
                        {num: '2', title: 'Консультация', desc: 'Обсуждаем детали'},
                        {num: '3', title: 'Макет', desc: 'Создаем дизайн'},
                        {num: '4', title: 'Производство', desc: 'Изготавливаем'},
                        {num: '5', title: 'Результат', desc: 'Готовый продукт'}
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center mb-2">
                                {step.num}
                            </div>
                            <h3 className="font-bold mb-1 dark:text-gray-200">{step.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 8. Портфолио */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <PortfolioSection
                    title="Наше портфолио"
                    description="Лучшие проекты за последние годы"
                    projects={recentProjects}
                    categories={categories}
                    columns={{
                        mobile: 1,
                        tablet: 2,
                        desktop: 3
                    }}
                    className="py-6"
                />
            </div>

            {/* 10. Новости */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Новости</h2>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="pb-4 border-b dark:border-gray-700 last:border-b-0">
                            <h3 className="font-bold text-lg mb-2 dark:text-gray-200">Новость {i}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">Краткое описание новости...</p>
                            <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                Подробнее
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 11. Клиенты */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Наши клиенты</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-20 bg-white dark:bg-gray-700 rounded border dark:border-gray-600 flex items-center justify-center">
                            <span className="dark:text-gray-300">Лого {i}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 12. FAQ */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Частые вопросы</h2>
                <div className="space-y-4">
                    {[
                        {q: 'Какой срок производства?', a: 'От 3 до 14 дней в зависимости от сложности'},
                        {q: 'Есть ли доставка?', a: 'Да, доставляем по всему городу и области'},
                        {q: 'Даете ли гарантию?', a: 'Гарантия от 6 месяцев на все работы'}
                    ].map((item, i) => (
                        <div key={i} className="border-b dark:border-gray-700 pb-4">
                            <h3 className="font-bold mb-2 dark:text-gray-200">{item.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 13. Форма заявки */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg border border-blue-100 dark:border-blue-800">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Оставить заявку</h2>
                <form className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Телефон"
                            className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded font-bold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
}