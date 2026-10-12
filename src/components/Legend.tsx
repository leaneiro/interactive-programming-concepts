export interface LegendItem {
  label: string;
  swatchClassName: string;
}

interface LegendProps {
  items: readonly LegendItem[];
}

export function Legend({ items }: LegendProps) {
  return (
    <ul className="absolute top-3.5 right-4 flex gap-4 font-mono text-meta text-tertiary sm:right-9">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-xs ${item.swatchClassName}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
