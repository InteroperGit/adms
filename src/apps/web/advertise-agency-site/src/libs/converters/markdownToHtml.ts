import {marked, Tokens} from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Кастомный рендерер
const renderer = new marked.Renderer();

renderer.listitem = (token: Tokens.ListItem): string => {
        // marked.parser() преобразует содержимое обратно в HTML
        const html = marked.parser(token.tokens);
        const cleanText = html.replace(/^<p>(.*?)<\/p>\n?$/, '$1');
        return `<li>${cleanText}</li>\n`;
}

/**
 * Преобразует строку в формате Markdown в HTML с использованием библиотеки
 * `marked` и очищает результат с помощью `purify` для предотвращения XSS-уязвимостей.
 *
 * @param {string} markdown — строка с текстом в формате Markdown, которую необходимо преобразовать в HTML.
 *
 * @returns {Promise<string>} Возвращает промис, который резолвится в строку, содержащую безопасный HTML.
 *
 * Пример использования:
 * ```ts
 * const htmlContent = await markdownToHtml('# Привет, мир!');
 * console.log(htmlContent); // <h1>Привет, мир!</h1>
 * ```
 */
export const markdownToHtml= async (markdown: string): Promise<string> => {
    const dirty = await marked(markdown, {
        async: true,
        renderer
    });
    return purify.sanitize(dirty);
}
