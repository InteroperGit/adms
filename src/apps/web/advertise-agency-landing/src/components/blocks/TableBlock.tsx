import { cn } from '@/libs/utils';
import type { TableBlock as TableBlockData } from '@/types/blocks';

interface TableBlockProps {
  block: TableBlockData;
}

/**
 * @component
 * @description Responsive table with mobile-card fallback, optional row highlighting and total row
 * @param {TableBlockProps} props
 * @param {TableBlockData} props.block - Table with head, rows, optional total and highlight
 * @returns {JSX.Element} Table for desktop, card list for mobile
 * @example
 * <TableBlock block={{ head: ["Name", "Value"], rows: [["Item", "100"]] }} />
 */
export function TableBlock({ block }: TableBlockProps) {
  const highlighted = new Set(block.highlight ?? []);

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-6 text-2xl font-bold md:text-3xl">{block.title}</h2>}

      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {block.rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              'cursor-pointer rounded-xl border border-border p-4 shadow-sm transition-colors hover:bg-muted/80 dark:hover:bg-muted/90',
              highlighted.has(i)
                ? 'border-l-2 border-l-primary bg-primary/5 dark:bg-primary/15'
                : 'bg-card'
            )}
          >
            {row.map((cell, j) => (
              <div key={j} className="flex flex-col py-1.5 first:pt-0 last:pb-0">
                {block.head[j] && (
                  <span
                    className={cn(
                      'mb-0.5 text-xs font-semibold uppercase tracking-wide text-foreground'
                    )}
                  >
                    {block.head[j]}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">{cell}</span>
              </div>
            ))}
          </div>
        ))}
        {block.total && (
          <div className="rounded-xl border-2 border-border bg-muted/60 p-4 shadow-sm">
            <div
              className={cn(
                'mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
              )}
            >
              {block.total[0]}
            </div>
            <div className="flex flex-col gap-1">
              {block.total.slice(1).map((cell, j) => (
                <div key={j} className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{block.head[j + 1]}</span>
                  <span className="text-sm font-semibold text-foreground">{cell}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn(
                'bg-gradient-to-r from-primary/20 to-primary/12',
                'dark:from-primary/40 dark:to-primary/30'
              )}
            >
              {block.head.map((col) => (
                <th
                  key={col}
                  className={cn(
                    'whitespace-nowrap px-4 py-3 text-left',
                    'text-xs font-semibold uppercase tracking-wide text-foreground'
                  )}
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
                  'cursor-pointer border-t border-border transition-colors hover:bg-muted/80 dark:hover:bg-muted/90',
                  highlighted.has(i)
                    ? 'border-l-2 border-l-primary bg-primary/5 dark:bg-primary/20'
                    : i % 2 === 0
                      ? 'bg-card'
                      : 'bg-muted/20 dark:bg-muted/40'
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
          {block.total && (
            <tfoot>
              <tr
                className={cn(
                  'border-t-2 border-border bg-muted/50 font-bold text-foreground dark:bg-muted/70'
                )}
              >
                {block.total.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {block.caption && (
        <p className="mt-3 text-center text-xs italic text-muted-foreground">{block.caption}</p>
      )}
    </div>
  );
}
