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
        'border-l-4 border-primary',
        'pl-6 pr-4 py-2 my-6 italic',
        'bg-gray-50 dark:bg-gray-800/50',
        'text-gray-600 dark:text-gray-300'
    ),
    table: cn('w-full my-6', 'border-collapse', 'rounded-lg overflow-hidden'),
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
 * TextArticleComponent
 *
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

const TextArticleComponent = ({ content, align = 'left' }: ArticleTextBlock) => (
    <article
        className={cn('prose dark:prose-invert max-w-none', `text-${align}`)}
        dangerouslySetInnerHTML={parseHtml(content)}
    />
);

export default TextArticleComponent;