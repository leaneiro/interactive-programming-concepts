import { useState } from "react";
import { Legend, type LegendItem } from "@/components/Legend";
import { readStoredValue, storeValue } from "@/lib/storage";
import { ForestTree } from "./ForestTree";
import type { ForestState } from "./forestState";
import { ParentArray } from "./ParentArray";
import { UnionList } from "./UnionList";

const representations = ["tree", "array"] as const;

type Representation = (typeof representations)[number];

const representationStorageKey = "ipc:forest-representation";

const representationLabels: Record<Representation, string> = {
  tree: "Tree",
  array: "Array",
};

const legendItems: readonly LegendItem[] = [
  { label: "current", swatchClassName: "bg-accent" },
  { label: "path", swatchClassName: "bg-waiting" },
  { label: "root", swatchClassName: "bg-sorted" },
  { label: "member", swatchClassName: "bg-pending" },
];

function readInitialRepresentation(): Representation {
  return readStoredValue(representationStorageKey) === "array"
    ? "array"
    : "tree";
}

interface ForestViewProps {
  state: ForestState;
}

export function ForestView({ state }: ForestViewProps) {
  const [representation, setRepresentation] = useState(
    readInitialRepresentation,
  );

  function showRepresentation(nextRepresentation: Representation): void {
    setRepresentation(nextRepresentation);
    storeValue(representationStorageKey, nextRepresentation);
  }

  return (
    <div className="relative flex size-full flex-col px-4 pt-10 pb-3">
      <Legend items={legendItems} />
      <div className="min-h-0 flex-1">
        {representation === "tree" ? (
          <ForestTree state={state} />
        ) : (
          <ParentArray state={state} />
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <UnionList unions={state.unions} />
        <div
          role="group"
          aria-label="Representation"
          className="flex shrink-0 rounded-lg bg-raised p-0.75 text-ui"
        >
          {representations.map((shownRepresentation) => (
            <button
              key={shownRepresentation}
              type="button"
              aria-pressed={shownRepresentation === representation}
              onClick={() => {
                showRepresentation(shownRepresentation);
              }}
              className="cursor-pointer rounded-md px-3 py-1.25 text-secondary aria-pressed:bg-selected aria-pressed:font-medium aria-pressed:text-foreground"
            >
              {representationLabels[shownRepresentation]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
