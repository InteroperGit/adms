import { cn } from '@/lib/utils';
import type { TableBlock as TableBlockData } from '@/types/portfolio/blocks';

interface TableBlockProps {
  block: TableBlockData;
}

export function TableBlock({ block }: TableBlockProps) {
  const highlighted = new Set(block.highlight ?? []);

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-6 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          {block.caption && (
            <caption className="mb-2 px-4 pt-3 text-left text-xs text-muted-foreground">
              {block.caption}
            </caption>
          )}
          <thead>
            <tr className="bg-muted/60">
              {block.head.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-left font-semibold text-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  'border-t border-border transition-colors',
                  highlighted.has(i) ? 'bg-primary/5' : i % 2 === 0 ? 'bg-white' : 'bg-muted/20'
                )}
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
