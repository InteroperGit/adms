import { cn } from '@/lib/utils';
import { resolveIcon } from '@/types/shared/iconMap';
import type { ProductType } from '@/types/config/orderForms';

interface OrderFormProductTabsProps {
  productTypes: ProductType[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function OrderFormProductTabs({
  productTypes,
  activeKey,
  onChange,
}: OrderFormProductTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:overflow-x-auto sm:pb-1">
      {productTypes.map((pt) => {
        const Icon = resolveIcon(pt.icon);
        const isActive = pt.key === activeKey;
        return (
          <button
            key={pt.key}
            type="button"
            onClick={() => onChange(pt.key)}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors sm:shrink-0 sm:rounded-full sm:py-2',
              isActive
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {Icon && <Icon size={16} />}
            {pt.label}
          </button>
        );
      })}
    </div>
  );
}
