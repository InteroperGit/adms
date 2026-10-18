// Split plain text into escaped text and validated HTTP(S) link segments.
// Rendering uses Astro expressions, never authored HTML or set:html.
export interface ParagraphSegment {
  text: string;
  href?: string;
}

export function paragraphLinks(text: string): ParagraphSegment[] {
  const segments: ParagraphSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(/\bhttps?:\/\/[^\s<>"']+/giu)) {
    let candidate = match[0].replace(/[.,;:!?]+$/u, '');
    // Sentence-closing brackets stay outside links; balanced URL brackets stay.
    for (const [open, close] of [
      ['(', ')'],
      ['[', ']'],
      ['{', '}'],
    ]) {
      while (
        candidate.endsWith(close) &&
        candidate.split(close).length > candidate.split(open).length
      ) {
        candidate = candidate.slice(0, -1);
      }
    }
    try {
      const url = new URL(candidate);
      // Avoid credential-bearing destinations and hidden control characters.
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u001f\u007f]/u.test(candidate)
      )
        continue;
    } catch {
      continue;
    }
    const start = match.index;
    if (start > cursor) segments.push({ text: text.slice(cursor, start) });
    segments.push({ text: candidate, href: candidate });
    cursor = start + candidate.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}
