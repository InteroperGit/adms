import { useRef } from 'react';
import { useAnimatedPillPosition } from '@/hooks/useAnimatedPillPosition';
import {cn} from "@/libs/utils.ts";

export interface AnimatedPillTabItem {
  label: React.ReactNode;
  value: string;
}

interface AnimatedPillTabsProps<T extends AnimatedPillTabItem> {
  items: T[];
  activeValue: string;
  renderItem: (item: T, isActive: boolean, index: number) => React.ReactNode;
}

/**
 * @component
 * @description Generic animated pill tabs component with sliding background indicator
 * @param {AnimatedPillTabsProps} props
 * @param {T[]} props.items - Array of tab items with label and value
 * @param {string} props.activeValue - Currently active tab value
 * @param {function} props.renderItem - Render function for each item (button, link, etc.)
 * @returns {JSX.Element} Container with animated pill and tab items
 * @example <caption>Animated tabs with buttons</caption>
 * <AnimatedPillTabs
 *   items={[{ label: 'All', value: 'all' }, { label: 'Web', value: 'web' }]}
 *   activeValue="all"
 *   renderItem={(item, isActive, idx) => (
 *     <button className={...}>{item.label}</button>
 *   )}
 * />
 */
export function AnimatedPillTabs<T extends AnimatedPillTabItem>({
  items,
  activeValue,
  renderItem,
}: AnimatedPillTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const activeIndex = items.findIndex((item) => item.value === activeValue);

  const { position: pillPosition, isAnimating } = useAnimatedPillPosition(
    containerRef,
    itemRefs,
    activeIndex
  );

  const itemClasses = "absolute rounded-full bg-primary shadow-sm";

  return (
    <div ref={containerRef} className="relative mb-10 flex flex-wrap justify-center gap-2">
      {/* Animated sliding pill */}
      <div
        className={
          isAnimating
            ? cn(itemClasses, 'transition-all duration-300 ease-out')
            : itemClasses
        }
        style={{
          left: `${pillPosition.left}px`,
          width: `${pillPosition.width}px`,
          height: `${pillPosition.height}px`,
          top: 0,
        }}
      />

      {/* Tab items */}
      {items.map((item, index) => (
        <div
          key={item.value}
          ref={(el) => {
            itemRefs.current[index] = el as HTMLElement;
          }}
        >
          {renderItem(item, item.value === activeValue, index)}
        </div>
      ))}
    </div>
  );
}
