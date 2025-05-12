import { cn } from '@/libs/utils'
import type { ArticleTableBlock } from '@/types/article'
import {JSX} from "react";

/**
 * Функция возвращает стандартную таблицу (table layout) с заголовками и строками.
 *
 * Зачем нужен:
 * - Для отображения таблиц в виде классического табличного интерфейса.
 * - Используется на десктопе и планшетах, где есть достаточно ширины экрана.
 *
 * Особенности:
 * - Используются стилизованные ячейки `th` и `td`, с выравниванием по `align`.
 * - Добавлены скругления углов для первой и последней ячеек.
 * - Реализована чередующаяся заливка строк и эффект наведения.
 */
const renderDesktopTable = (headers: string[], rows: string[][], align: string[]): JSX.Element => {
    return (
        <table className="w-full border-collapse hidden md:table">
            <thead>
                <tr>
                    {headers.map((header, i) => (
                        <th
                            key={i}
                            className={cn(
                                'p-4 text-sm md:text-base font-semibold',
                                'bg-gray-100 dark:bg-gray-800',
                                'border-b border-gray-200 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'whitespace-nowrap tracking-wide',
                                align[i] === 'center' && 'text-center',
                                align[i] === 'right' && 'text-right',
                                i === 0 && 'rounded-tl-lg',
                                i === headers.length - 1 && 'rounded-tr-lg'
                            )}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr
                        key={i}
                        className={cn(
                            'transition-colors duration-150',
                            'border-b border-gray-100 dark:border-gray-700',
                            i % 2 === 0
                                ? 'bg-white dark:bg-gray-900'
                                : 'bg-gray-50 dark:bg-gray-800',
                            'hover:bg-orange-100 dark:hover:bg-orange-400'
                        )}
                    >
                        {row.map((cell, j) => (
                            <td
                                key={j}
                                className={cn(
                                    'p-4 text-sm md:text-base leading-relaxed font-light',
                                    'text-gray-800 dark:text-gray-200',
                                    'border border-gray-100 dark:border-gray-700',
                                    'break-words',
                                    align[j] === 'center' && 'text-center',
                                    align[j] === 'right' && 'text-right',
                                    i === rows.length - 1 && j === 0 && 'rounded-bl-lg',
                                    i === rows.length - 1 && j === row.length - 1 && 'rounded-br-lg'
                                )}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

/**
 * Функция возвращает компактный список для мобильных устройств,
 * где каждая строка таблицы отображается в виде вертикального блока с ключ-значение.
 *
 * Зачем нужен:
 * - Повышает читаемость таблицы на узких экранах.
 * - Избегает горизонтального скролла на мобильных устройствах.
 *
 * Особенности:
 * - Каждая строка отображается как карточка со стилизованными подписями (headers).
 * - Используется адаптивный `flex`-layout и скруглённые контейнеры.
 * - Отображаются только строки — заголовки используются как подписи к ячейкам.
 */
const renderMobileList = (headers: string[], rows: string[][]): JSX.Element => {
    return (
        <div className="space-y-4 md:hidden">
            {rows.map((row, i) => (
                <div
                    key={i}
                    className={cn(
                        'rounded-lg p-4 shadow-sm',
                        'bg-white dark:bg-gray-800',
                        'border border-gray-200 dark:border-gray-700',
                        // Зебра-эффект для фонов строк
                        i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600',
                    )}
                >
                    {row.map((cell, j) => (
                        <div key={j} className="mb-3">
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                {headers[j]}
                            </div>
                            <div className="text-lg text-gray-800 dark:text-gray-200 font-medium">
                                {cell}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * TableArticleComponent
 *
 * Универсальный компонент для отображения таблиц в статьях или CMS-контенте
 * с автоматическим переключением между табличным и списочным видом в зависимости от ширины экрана.
 *
 * Зачем нужен:
 * - Отображает данные в виде таблицы на больших экранах и в виде карточек-списков на мобильных.
 * - Обеспечивает адаптивность без потери читабельности и структуры данных.
 * - Позволяет задать индивидуальное выравнивание колонок через проп `align` (left / center / right).
 *
 * Особенности:
 * - Использует семантические элементы `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` на десктопе.
 * - Мобильный режим (через `md:hidden`) отображает строки в виде отдельных блоков,
 * де каждая пара «заголовок — значение» показана в отдельной строке.
 * - Стилизация с тёмной темой, поддержка скруглений, чередующихся строк и плавных эффектов наведения.
 *
 * Где использовать:
 * - В контенте из CMS, Markdown или JSON, где нужно красиво отрисовать таблицу без ручного верстки.
 * - В блогах, технических статьях, отчётах и любых текстовых публикациях с табличными данными.
 */
const TableArticleBlock = ({
                               headers,
                               rows,
                               align = [],
                           }: ArticleTableBlock): JSX.Element => {
    return (
        <div className="my-6 overflow-x-auto rounded-xl shadow-sm">
            {renderDesktopTable(headers, rows, align)}
            {renderMobileList(headers, rows)}
        </div>
    )
}

export default TableArticleBlock;
