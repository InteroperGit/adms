import { cn } from '@/libs/utils';

interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * @component
 * @description Reusable card container with hover lift animation and primary border in dark mode
 * @param {ItemCardProps} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element} Card container with shared styling and animations
 * @example <caption>Item card wrapper</caption>
 * <ItemCard>
 *   <div>Content here</div>
 * </ItemCard>
 */
export function ItemCard({ className, children, ...props }: ItemCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-border dark:border-primary/30 bg-card',
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
