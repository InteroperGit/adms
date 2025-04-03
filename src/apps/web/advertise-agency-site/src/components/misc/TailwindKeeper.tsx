// components/TailwindKeeper.tsx
import React from 'react';

/**
 * Компонент-донор для сохранения всех используемых классов Tailwind CSS в сборке.
 * Этот компонент НЕ должен использоваться в реальном интерфейсе - он только
 * предотвращает удаление классов оптимизатором Tailwind.
 */
export default function TailwindKeeper() {
    return (
        <div className="hidden">
            {/* Текстовые блоки и заголовки */}
            <div className="
                prose dark:prose-invert max-w-none
                text-3xl text-2xl text-xl text-lg text-base text-sm
                font-bold font-semibold font-normal
                mt-12 mt-10 mt-8 mt-6 mt-4 mt-2 mt-0
                mb-12 mb-10 mb-8 mb-6 mb-4 mb-2 mb-0
                my-15 my-10 my-8 my-6 my-4 my-2 my-0
                leading-relaxed leading-snug leading-normal
                text-gray-700 text-gray-600 text-gray-500 text-gray-400 text-gray-300
                dark:text-gray-300 dark:text-gray-400 dark:text-gray-500
                list-disc list-decimal
                'list-disc pl-6'
                'my-4 space-y-2'
                'marker:text-gray-400 dark:marker:text-gray-500'
              "></div>

            {/* Цитаты */}
            <div className="
                border-l-4 border-orange-500 dark:border-orange-700
                bg-orange-50 dark:bg-gray-800
                p-6 pl-4
                italic not-italic
              "></div>

            {/* Изображения */}
            <div className="
                relative aspect-video
                rounded-lg rounded-none
                overflow-hidden
                object-cover object-contain
                max-w-full w-full
                my-6 my-8
              "></div>

            {/* Галереи */}
            <div className="
                grid flex columns-2 columns-3
                gap-4
                min-w-[300px]
                break-inside-avoid
                pb-4
                grid-cols-2 grid-cols-3
              "></div>

            {/* Таблицы */}
            <div className="
                border-collapse
                bg-gray-100 dark:bg-gray-700
                hover:bg-orange-100 dark:hover:bg-orange-400
                border border-gray-200 dark:border-gray-600
                text-left text-center text-right
                p-3
              "></div>

            {/* Код */}
            <div className="
                bg-gray-800 bg-gray-700
                language-plaintext
                line-numbers
                px-4 py-2
                rounded-lg
              "></div>

            {/* Разделители */}
            <div className="
                border-solid border-dashed border-dotted
                border-t border-gray-200 dark:border-gray-700
              "></div>

            {/* Видео */}
            <div className="
                relative
                rounded-lg
                iframe
              "></div>

            {/* Общие классы */}
            <div className="
                mx-auto
                text-center
                text-primary
                hover:underline
                dark:bg-gray-800/30
                [data-theme='dark']
              "></div>
        </div>
    );
};
