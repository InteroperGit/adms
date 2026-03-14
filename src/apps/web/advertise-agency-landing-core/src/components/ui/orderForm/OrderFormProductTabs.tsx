import { cn } from '@/lib/utils';
import { resolveIcon } from '@/types/shared/iconMap';
import type { ProductType } from '@/types/config/orderForms';

interface OrderFormProductTabsProps {
  productTypes: ProductType[];
  activeKey: string;
  onChange: (key: string) => void;
}

/**
 * @component
 * @description Tab selector for switching between product types in order form with icons and active state
 * @param {OrderFormProductTabsProps} props
 * @param {ProductType[]} props.productTypes - Available product configurations
 * @param {string} props.activeKey - Currently selected product key
 * @param {(key: string) => void} props.onChange - Product selection handler
 * @returns {JSX.Element} Grid of tab buttons with icons
 * @example
 * <OrderFormProductTabs productTypes={products} activeKey="premium" onChange={selectProduct} />
 */
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
