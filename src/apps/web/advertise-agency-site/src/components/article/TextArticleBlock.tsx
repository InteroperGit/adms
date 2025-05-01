import { parse } from 'node-html-parser';
import { cn } from '@/libs/utils';
import {ArticleTextBlock} from "@/types/article";

interface TextStyles {
    h1: string;
    h2: string;
    h3: string;
    p: string;
    ul: string;
    ol: string;
    li: string;
    blockquote: string;
    table: string;
    th: string;
    tr: string;
    td: string;
    a: string;
    code: string;
    pre: string;
    img: string;
}

const textStyles: TextStyles = {
    h1: cn('text-3xl font-bold', 'mt-12 mb-6 leading-tight', 'text-gray-900 dark:text-white'),
    h2: cn('text-2xl font-bold', 'my-10 leading-snug', 'text-gray-800 dark:text-gray-100'),
    h3: cn('text-xl font-semibold', 'mt-8 mb-3 leading-normal', 'text-gray-700 dark:text-gray-200'),
    p: cn('text-xl', 'my-6 leading-relaxed', 'text-gray-700 dark:text-gray-300'),
    ul: cn('checkmark-list'),
    ol: cn('rounded-list'),
    li: cn(),
    blockquote: cn(
        "my-8 border-l-4 border-orange-500 dark:border-orange-700",
        "bg-orange-50 dark:bg-gray-800",
        "p-6",
        "text-gray-700 dark:text-gray-200",
        "rounded-xl shadow-sm",
    ),
    table: cn(
        'w-full my-6',
        'border border-2 border-gray-200 dark:border-gray-600',
        'border-collapse',
        'overflow-hidden'
    ),
    th: cn(
        'p-3 text-left font-semibold',
        'bg-gray-100 dark:bg-gray-700',
        'border-b border-gray-200 dark:border-gray-600',
        'text-gray-700 dark:text-gray-200'
    ),
    td: cn(
        'p-3',
        'border-b border-gray-100 dark:border-gray-700',
        'text-gray-600 dark:text-gray-300'
    ),
    tr: cn(
        // Зебра: только на четных строках
        'even:bg-gray-50 dark:even:bg-gray-800',
        // Hover-эффект
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        // Плавный переход
        'transition-colors'
    ),
    a: cn(
        'text-primary hover:text-primary/80',
        'underline underline-offset-4',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
    ),
    code: cn(
        'bg-gray-100 dark:bg-gray-700',
        'px-1.5 py-0.5 rounded',
        'text-sm font-mono',
        'text-gray-800 dark:text-gray-200'
    ),
    pre: cn(
        'bg-gray-800 rounded-lg',
        'p-4 my-4 overflow-x-auto',
        'text-gray-100',
        'font-mono text-sm leading-relaxed'
    ),
    img: cn(
        'my-6 rounded-lg',
        'max-w-full h-auto',
        'shadow-md dark:shadow-none',
        'border border-gray-200 dark:border-gray-700'
    ),
};

const parseHtml = (html: string) => {
    try {
        const root = parse(html);

        Object.entries(textStyles).forEach(([tag, className]) => {
            root.querySelectorAll(tag).forEach(el => {
                const existing = el.getAttribute('class') || '';
                el.setAttribute('class', `${existing} ${className}`.trim());
            });
        });

        root.querySelectorAll('a').forEach(el => {
            if (!el.getAttribute('class')) {
                el.setAttribute('class', textStyles.a);
            }
        });

        return { __html: root.toString() };
    } catch (e) {
        console.error('HTML parsing failed:', e);
        return { __html: html };
    }
};

/**
 * Компонент для рендеринга HTML-контента (например, из CMS или Markdown),
 * автоматически применяя предопределённые стили Tailwind для всех стандартных тегов.
 *
 * Зачем нужен:
 * - Позволяет централизованно стилизовать теги (`h1`, `p`, `ul`, `a`, `code`, `table` и т.д.)
 *   без необходимости вручную добавлять классы при каждом рендере HTML.
 * - Поддерживает тёмную тему и аккуратную типографику.
 * - Поддерживает выравнивание текста (`left`, `center`, `right`) через пропс `align`.
 * - Безопасно обрабатывает HTML через парсер `node-html-parser`, не ломая структуру.
 *
 * Где использовать:
 * - Внутри статей, блогов, документации, заметок и других текстовых блоков,
 *   где приходит готовая HTML-разметка и нужна строгая визуальная консистентность.
 */
export default function TextArticleBlock({ content, align = 'left' }: ArticleTextBlock) {
    return (
        <article
            className={cn('prose dark:prose-invert max-w-none', `text-${align}`)}
            dangerouslySetInnerHTML={parseHtml(content)}
        />
    );
};
