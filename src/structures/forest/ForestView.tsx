import { Legend, type LegendItem } from "@/components/Legend";
import { ForestTree } from "./ForestTree";
import type { ForestState } from "./forestState";
import { UnionList } from "./UnionList";

const legendItems: readonly LegendItem[] = [
  { label: "current", swatchClassName: "bg-accent" },
  { label: "path", swatchClassName: "bg-waiting" },
  { label: "root", swatchClassName: "bg-sorted" },
  { label: "member", swatchClassName: "bg-pending" },
];

interface ForestViewProps {
  state: ForestState;
}

export function ForestView({ state }: ForestViewProps) {
  return (
    <div className="relative flex size-full flex-col px-4 pt-10 pb-3">
      <Legend items={legendItems} />
      <div className="min-h-0 flex-1">
        <ForestTree state={state} />
      </div>
      <UnionList unions={state.unions} />
    </div>
  );
}
