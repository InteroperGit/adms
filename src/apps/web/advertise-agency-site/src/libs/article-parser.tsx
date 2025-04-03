import React from 'react';
import Image from 'next/image';
import {
    ArticleBlock,
    PortfolioBlock,
    ImageGalleryBlock,
    TextBlock,
    ImageBlock,
    VideoBlock,
    QuoteBlock, CodeBlock, TableBlock, DividerBlock, EmbedBlock
} from '@/types/article';
import {cn} from "@/libs/utils";
import { parse } from 'node-html-parser';
import {PortfolioSection} from "@/components/sections/PortfolioSection";
import {
    Card, CardContent,
} from "@/components/ui/card"

//Типы для стилей
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
    h1: cn(
        'text-3xl font-bold',
        'mt-12 mb-6 leading-tight',
        'text-gray-900 dark:text-white'
    ),
    h2: cn(
        'text-2xl font-bold',
        'my-10 leading-snug',
        'text-gray-800 dark:text-gray-100'
    ),
    h3: cn(
        'text-xl font-semibold',
        'mt-8 mb-3 leading-normal',
        'text-gray-700 dark:text-gray-200'
    ),
    p: cn(
        'my-6 leading-relaxed',
        'text-gray-700 dark:text-gray-300',
        'max-w-prose' // Ограничение ширины для читаемости
    ),
    ul: cn(
        'list-disc pl-6',
        'my-4 space-y-2', // Улучшенные отступы между пунктами
        'marker:text-gray-400 dark:marker:text-gray-500' // Стилизация маркеров
    ),
    ol: cn("rounded-list"),
    li: cn(),
    blockquote: cn(
        'border-l-4 border-primary',
        'pl-6 pr-4 py-2 my-6 italic',
        'bg-gray-50 dark:bg-gray-800/50',
        'text-gray-600 dark:text-gray-300'
    ),
    table: cn(
        'w-full my-6',
        'border-collapse',
        'rounded-lg overflow-hidden'
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
    )
};

const parseHtml = (html: string) => {
    try {
        const root = parse(html);

        // Применяем классы ко всем элементам
        Object.entries(textStyles).forEach(([tag, className]) => {
            root.querySelectorAll(tag).forEach(el => {
                // Сохраняем существующие классы и добавляем новые
                const existingClasses = el.getAttribute('class') || '';
                el.setAttribute('class', `${existingClasses} ${className}`.trim());
            });
        });

        // Специальная обработка для ссылок (чтобы не перезаписать href)
        root.querySelectorAll('a').forEach(el => {
            if (!el.getAttribute('class')) {
                el.setAttribute('class', textStyles.a);
            }
        });

        return { __html: root.toString() };
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return { __html: html }; // Возвращаем оригинал в случае ошибки
    }
};

/**
 * Компонент для текстового блока
 */
const TextBlockComponent = ({ content, align = "left" }: TextBlock) => (
    <div
        className={cn("prose dark:prose-invert max-w-none", `text-${align}`)}
        dangerouslySetInnerHTML={parseHtml(content)}
    />
);

/**
 * Компонент для изображения
 */
const ImageBlockComponent = ({
                        url,
                        alt,
                        caption,
                        width = 800,
                        height = 600,
                        fullWidth = false
                    }: ImageBlock) => (
    <figure className={`my-6 ${fullWidth ? 'w-full' : 'max-w-full'}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
                src={url}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
            />
        </div>
        {caption && (
            <figcaption className="text-sm text-center mt-2 text-gray-500 dark:text-gray-400">
                {caption}
            </figcaption>
        )}
    </figure>
);

/**
 * Компонент для галереи изображений
 */
const ImageGalleryBlockComponent = ({
                          images,
                          layout = 'grid',
                          columns = 3
                      }: ImageGalleryBlock) => {
    const galleryClasses = cn(
        'my-8 gap-4',
        {
            'grid': layout === 'grid',
            'flex overflow-x-auto pb-4': layout === 'carousel',
            'columns-3': layout === 'masonry' && columns === 3,
            'columns-2': layout === 'masonry' && columns === 2,
            [`grid-cols-${columns}`]: layout === 'grid',
        }
    );

    const itemClasses = cn(
        'relative',
        {
            'aspect-video': layout !== 'masonry',
            'min-w-[300px]': layout === 'carousel',
            'break-inside-avoid mb-4': layout === 'masonry',
        }
    );

    return (
        <div className={galleryClasses}>
            {images.map((img, idx) => (
                <figure key={idx} className={itemClasses}>
                    <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="rounded-lg object-cover"
                        sizes={layout === 'grid' ? `(max-width: 768px) 100vw, ${800/columns}px` : '800px'}
                    />
                    {img.caption && (
                        <figcaption className="text-sm mt-2 text-center text-gray-500 dark:text-gray-400">
                            {img.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
};

/**
 * Компонент для галереи превью проектов (обычно для портфолио)
 * @param previews
 * @param columns
 * @constructor
 */
const PortfolioBlockComponent = ({ projects, columns}: PortfolioBlock) => {
    return (
        <PortfolioSection title={"Примеры работ"}
                          projects={projects}
        />
    );
}

/**
 * Компонент для видео
 */
const VideoBlockComponent = ({
                        url,
                        source,
                        caption,
                        aspectRatio = '16:9'
                    }: VideoBlock) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    const paddingBottom = `${(height / width) * 100}%`;

    const embedUrl = source === 'youtube'
        ? `https://www.youtube.com/embed/${url.split('v=')[1]}`
        : source === 'vimeo'
            ? `https://player.vimeo.com/video/${url.split('/').pop()}`
            : url;

    return (
        <div className="my-8">
            <div className="relative w-full" style={{ paddingBottom }}>
                <iframe
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
            {caption && (
                <figcaption className="text-sm mt-2 text-center text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </div>
    );
};

/**
 * Компонент для цитаты
 */
const QuoteBlockComponent = ({
                        text,
                        author,
                        source,
                    }: QuoteBlock) => (
    <blockquote
        className={cn(
            "my-8 border-l-4 border-orange-500 dark:border-orange-700",
            "bg-orange-50 dark:bg-gray-800",
            "p-6 italic",
            "text-gray-600 dark:text-gray-300",
        )}
    >
        <p className="text-lg mb-3">{text}</p>
        {(author || source) && (
            <footer className="mt-10 not-italic text-sm">
                {author && <span className="font-semibold">{author}</span>}
                {source && <cite className="ml-2">{source}</cite>}
            </footer>
        )}
    </blockquote>
);

/**
 * Компонент для кода
 */
const CodeBlockComponent = ({
                       code,
                       language,
                       showLineNumbers = false
                   }: CodeBlock) => (
    <div className="my-6 bg-gray-800 rounded-lg overflow-hidden">
        {language && (
            <div className="px-4 py-2 text-xs text-gray-300 bg-gray-700">
                {language}
            </div>
        )}
        <pre className={`p-4 overflow-x-auto text-sm ${showLineNumbers ? 'line-numbers' : ''}`}>
          <code className={`language-${language || 'plaintext'}`}>
            {code}
          </code>
        </pre>
    </div>
);

/**
 * Компонент для таблицы
 */
const TableBlockComponent = ({
                        headers,
                        rows,
                        align = []
                    }: TableBlock) => (
    <div className="my-6 overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full border-collapse">
            <thead>
            <tr>
                {headers.map((header, i) => (
                    <th
                        key={i}
                        className={cn(
                            'p-3 font-semibold',
                            'bg-gray-100 dark:bg-gray-800',
                            'border-b border-gray-200 dark:border-gray-700',
                            'text-gray-700 dark:text-gray-300',
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
                                'p-3',
                                'text-gray-800 dark:text-gray-200',
                                'border border-gray-100 dark:border-gray-700',
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
    </div>
);

/**
 * Компонент для разделителя
 */
const DividerBlockComponent = ({
                          style = 'solid'
                      }: DividerBlock) => {
    const borderStyle = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
    }[style];

    return (
        <hr className={`my-8 border-t ${borderStyle} border-gray-200 dark:border-gray-700`} />
    );
};

const EmbededBlockComponent= ({ html, url, width, height }: EmbedBlock) => {
    if (html) {
        return (
            <div
                className="my-6"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }
    return (
        <div className="my-6">
            <iframe
                src={url}
                width={width || '100%'}
                height={height || '400px'}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
            />
        </div>
    );
}

/**
 * Главный парсер статьи
 */
export const ArticleParser = ({ blocks }: { blocks: ArticleBlock[] }) => {
    return (
        <div className="article-content">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return <TextBlockComponent
                            key={index}
                            {...block}
                        />;

                    case 'image':
                        return (
                            <ImageBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'imageGallery':
                        return (
                            <ImageGalleryBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'video':
                        return (
                            <VideoBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'portfolio':
                        return (
                            <Card>
                                <CardContent>
                                    <PortfolioBlockComponent key={index} {...block} />
                                </CardContent>
                            </Card>
                        );

                    case 'quote':
                        return (
                            <QuoteBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'code':
                        return (
                            <CodeBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'table':
                        return (
                            <TableBlockComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'divider':
                        return <DividerBlockComponent
                            key={index}
                            {...block}
                        />;

                    case 'embed':
                        return <EmbededBlockComponent
                            key={index}
                            {...block}
                        />;

                    default:
                        return null;
                }
            })}
        </div>
    );
};