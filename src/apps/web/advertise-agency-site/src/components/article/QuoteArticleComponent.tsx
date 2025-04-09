import {QuoteBlock} from "@/types/article";
import {cn} from "@/libs/utils";

/**
 * Компонент для отображения цитат с автором и источником.
 * Предназначен для использования в статьях, блогах или других текстовых блоках, где требуется отображение цитаты с возможностью указания автора и источника.
 *
 * Зачем нужен:
 * - Отображает цитату в виде блочного элемента с выделенной левой границей и стильным фоном.
 * - Поддерживает отображение дополнительной информации о цитате, такой как автор и источник, если они предоставлены.
 * - Использует стили для улучшенной визуальной читаемости и выделения цитаты на странице.
 *
 * Пропсы:
 * - `text`: основной текст цитаты.
 * - `author`: автор цитаты (необязательное поле).
 * - `source`: источник цитаты (необязательное поле).
 *
 * Особенности:
 * - Левый бордер с ярким цветом (`border-orange-500`) помогает визуально выделить цитату.
 * - Возможность добавить или автор, или источник, или оба. Если они присутствуют, отображаются под цитатой.
 * - Фоновая заливка в светлых и темных темах для улучшенной читаемости.
 *
 * Где использовать:
 * - В статьях и блогах для выделения ключевых цитат.
 * - Для использования в портфолио, кейс-стади и других контентных блоках, где важны цитаты или отзывы.
 */
const QuoteArticleComponent = ({
                                   text,
                                   author,
                                   source,
                               }: QuoteBlock) => (
    <blockquote
        className={cn(
            "my-8 border-l-4 border-orange-500 dark:border-orange-700",
            "bg-orange-50 dark:bg-gray-800",
            "p-6",
            "text-gray-700 dark:text-gray-200",
            "rounded-xl shadow-sm",
        )}
    >
        <p className="text-2xl leading-relaxed font-light mb-3 text-balance font-sans">
            {text}
        </p>
        {(author || source) && (
            <footer className="mt-10 not-italic text-sm text-gray-500 dark:text-gray-400">
                {author && (
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {author}
                    </span>
                )}
                {source && <cite className="ml-2 italic">{source}</cite>}
            </footer>
        )}
    </blockquote>
);

export default QuoteArticleComponent;