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

export async function markdownToHtml(markdown: string): Promise<string> {
    const dirty = await marked(markdown, {
        async: true,
        renderer
    });
    return purify.sanitize(dirty);
}
