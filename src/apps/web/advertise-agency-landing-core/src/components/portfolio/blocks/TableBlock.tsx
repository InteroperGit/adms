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
      {block.caption && <p className="mb-3 text-xs text-muted-foreground">{block.caption}</p>}

      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {block.rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              'cursor-pointer rounded-xl border border-border p-4 shadow-sm transition-colors hover:bg-primary/10',
              highlighted.has(i) ? 'bg-primary/5' : 'bg-white'
            )}
          >
            {row.map((cell, j) => (
              <div key={j} className="flex flex-col py-1.5 first:pt-0 last:pb-0">
                {block.head[j] && (
                  <span className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-foreground">
                    {block.head[j]}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border shadow-sm sm:block">
        <table className="w-full text-sm">
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
                  'cursor-pointer border-t border-border transition-colors hover:bg-primary/10',
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
