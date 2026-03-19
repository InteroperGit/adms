import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/libs/utils';
import type { CodeBlock as CodeBlockData } from '@/types/blocks';

interface CodeBlockProps {
  block: CodeBlockData;
}

/**
 * @component
 * @description Code snippet display with dark background, copy button, optional JSON syntax
 * highlighting, and optional line number gutter
 * @param {CodeBlockProps} props
 * @param {CodeBlockData} props.block - Code block with code string, optional language, caption,
 * and showLineNumbers flag
 * @returns {JSX.Element} Pre/code figure with language badge and copy button
 * @example
 * <CodeBlock block={{ code: '{"key": "value"}', language: "json", showLineNumbers: true }} />
 */

/** Tokenize JSON string into HTML with syntax-colored spans. */
function tokenizeJson(code: string): string {
  return code.replace(
    /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(true|false|null)/g,
    (match, key, str, num, keyword) => {
      if (key) {
        return `<span class="text-sky-300">${key}</span>:`;
      }
      if (str) {
        return `<span class="text-emerald-300">${str}</span>`;
      }
      if (num) {
        return `<span class="text-amber-300">${num}</span>`;
      }
      if (keyword) {
        return `<span class="text-rose-400">${keyword}</span>`;
      }
      return match;
    }
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function CodeBlock({ block }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = block.code.split('\n');
  const isJson = block.language === 'json';

  const renderCode = () => {
    if (block.showLineNumbers) {
      return lines.map((line, i) => {
        const html = isJson ? tokenizeJson(escapeHtml(line)) : escapeHtml(line);
        return (
          <div key={i} className="flex">
            <span
              className="mr-4 w-8 shrink-0 select-none text-right text-neutral-500"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        );
      });
    }

    if (isJson) {
      return <code dangerouslySetInnerHTML={{ __html: tokenizeJson(escapeHtml(block.code)) }} />;
    }

    return <code>{block.code}</code>;
  };

  return (
    <figure className="mx-auto max-w-4xl">
      <div
        className={cn(
          'flex items-center justify-between rounded-t-lg border border-b-0 border-neutral-700',
          'bg-neutral-800 px-4 py-2'
        )}
      >
        <span className="text-xs font-medium text-neutral-400">{block.language ?? 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Скопировано' : 'Скопировать код'}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100 focus-ring"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <pre
        className={cn(
          'overflow-x-auto rounded-b-lg border border-neutral-700',
          'bg-neutral-900 p-4 font-mono text-sm leading-relaxed text-neutral-100'
        )}
      >
        {block.showLineNumbers ? <code className="block">{renderCode()}</code> : renderCode()}
      </pre>
      {block.caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
