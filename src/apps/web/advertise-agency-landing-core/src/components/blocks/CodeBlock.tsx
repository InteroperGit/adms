import { cn } from '@/libs/utils';
import type { CodeBlock as CodeBlockData } from '@/types/portfolio/blocks';

interface CodeBlockProps {
  block: CodeBlockData;
}

/**
 * @component
 * @description Code snippet display with optional language label and caption
 * @param {CodeBlockProps} props
 * @param {CodeBlockData} props.block - Code block with code string, optional language and caption
 * @returns {JSX.Element} Pre/code figure with language badge
 * @example
 * <CodeBlock block={{ code: "console.log('hello')", language: "javascript", caption: "Example" }} />
 */
export function CodeBlock({ block }: CodeBlockProps) {
  return (
    <figure className="mx-auto max-w-4xl">
      {block.language && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-t-lg border border-b-0 border-border',
            'bg-muted/80 px-4 py-2'
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">{block.language}</span>
        </div>
      )}
      <pre
        className={cn(
          'overflow-x-auto rounded-lg border border-border bg-muted p-4',
          'font-mono text-sm leading-relaxed text-foreground'
        )}
        style={{
          borderTopLeftRadius: block.language ? 0 : undefined,
          borderTopRightRadius: block.language ? 0 : undefined,
        }}
      >
        <code>{block.code}</code>
      </pre>
      {block.caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
