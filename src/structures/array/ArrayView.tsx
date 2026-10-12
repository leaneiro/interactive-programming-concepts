import { Legend, type LegendItem } from "@/components/Legend";
import type { ArrayState } from "./arrayState";

const tallestBarHeightPercent = 83;

const legendItems: readonly LegendItem[] = [
  { label: "comparing", swatchClassName: "bg-accent" },
  { label: "pending", swatchClassName: "bg-pending" },
  { label: "sorted", swatchClassName: "bg-sorted" },
];

interface ArrayViewProps {
  state: ArrayState;
}

export function ArrayView({ state }: ArrayViewProps) {
  const largestValue = Math.max(1, ...state.values);

  function statusOf(valueIndex: number): string {
    if (state.comparedIndices.includes(valueIndex)) return "comparing";
    if (state.sortedIndices.includes(valueIndex)) return "sorted";
    return "pending";
  }

  return (
    <div className="relative size-full px-4 pt-8.5 sm:px-9">
      <Legend items={legendItems} />
      <ol aria-label="Array values" className="flex size-full gap-2 sm:gap-4">
        {state.values.map((value, valueIndex) => (
          <li key={valueIndex} className="relative mt-6 min-w-0 flex-1">
            <div
              data-status={statusOf(valueIndex)}
              style={{
                height: `max(4px, ${(value / largestValue) * tallestBarHeightPercent}%)`,
              }}
              className="group absolute inset-x-0 bottom-0 rounded-t-sm bg-pending transition-[height,background-color] duration-200 ease-out data-[status=comparing]:bg-accent data-[status=sorted]:bg-sorted"
            >
              <span className="absolute inset-x-0 -top-6 text-center font-mono text-meta text-secondary group-data-[status=comparing]:font-medium group-data-[status=comparing]:text-accent-text">
                {value}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
