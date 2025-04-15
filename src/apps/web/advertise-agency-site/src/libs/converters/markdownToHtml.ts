import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function markdownToHtml(markdown: string): Promise<string> {
    const dirty = await marked(markdown, { async: true });
    return purify.sanitize(dirty);
}
