/**
 * Custom tooltip renderer for Recharts bar and line charts.
 * Displays a card with the label and value using theme-aware colors and styling.
 * Only renders when active (tooltip is visible) and has payload data. The tooltip
 * respects dark mode via CSS variables and uses the card background color.
 *
 * @component
 * @description Renders a theme-aware tooltip card for Recharts visualizations
 * @param {Object} props
 * @param {boolean} [props.active] - Whether the tooltip is currently active
 * @param {Array<{ payload: Record<string, string | number> }>} [props.payload] - Tooltip data array from Recharts
 * @returns {JSX.Element | null} Styled card element or null if inactive
 *
 * @example <caption>Used within Recharts Tooltip component</caption>
 * <Tooltip
 *   content={<CustomTooltip />}
 *   cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
 * />
 */
export function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Record<string, string | number> }>;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const displayValue = data.displayValue || `${payload[0].payload.value}`;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{data.label}</p>
      <p className="text-sm font-bold text-primary">{displayValue}</p>
    </div>
  );
}
