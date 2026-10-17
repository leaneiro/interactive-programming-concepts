import { Legend, type LegendItem } from "@/components/Legend";
import type { SearchRangeState } from "./searchRangeState";

const legendItems: readonly LegendItem[] = [
  { label: "middle", swatchClassName: "bg-accent" },
  { label: "in range", swatchClassName: "bg-raised" },
  { label: "found", swatchClassName: "bg-sorted" },
];

const outcomeLabels = { found: "found", missing: "not there" } as const;

interface SearchRangeViewProps {
  state: SearchRangeState;
}

export function SearchRangeView({ state }: SearchRangeViewProps) {
  const pointers = [
    { name: "low", position: state.low },
    { name: "mid", position: state.middle },
    { name: "high", position: state.high },
  ];

  function isInRange(valueIndex: number): boolean {
    if (state.low === null || state.high === null) return true;
    return state.low <= valueIndex && valueIndex <= state.high;
  }

  function statusOf(valueIndex: number): string {
    if (valueIndex === state.middle) {
      return state.outcome === "found" ? "found" : "middle";
    }
    return isInRange(valueIndex) ? "candidate" : "discarded";
  }

  return (
    <div className="relative flex size-full flex-col justify-center px-4 pt-12 pb-6 sm:px-9">
      <Legend items={legendItems} />

      <section aria-label="Sorted array" className="flex flex-col gap-2.5">
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="section-label normal-case">{state.name}</h3>
          <p
            data-outcome={state.outcome}
            className="group font-mono text-meta text-tertiary"
          >
            looking for{" "}
            <span className="font-medium text-accent-text">{state.target}</span>
            {state.outcome !== "searching" && (
              <>
                {" → "}
                <span className="text-faded group-data-[outcome=found]:font-medium group-data-[outcome=found]:text-sorted">
                  {outcomeLabels[state.outcome]}
                </span>
              </>
            )}
          </p>
        </header>
        <ol className="grid auto-cols-fr grid-flow-col gap-1 sm:gap-2.5">
          {state.values.map((value, valueIndex) => (
            <li
              key={valueIndex}
              className="flex min-w-0 flex-col items-center gap-1.5"
            >
              <span
                data-status={statusOf(valueIndex)}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-raised font-mono text-cell text-foreground transition-colors duration-200 data-[status=discarded]:bg-transparent data-[status=discarded]:text-ghost data-[status=discarded]:ring-1 data-[status=discarded]:ring-border data-[status=discarded]:ring-inset data-[status=found]:bg-sorted data-[status=found]:font-medium data-[status=found]:text-surface data-[status=middle]:bg-accent data-[status=middle]:font-medium data-[status=middle]:text-on-accent sm:h-14 sm:text-counter"
              >
                {value}
              </span>
              <span className="font-mono text-index text-faded">
                {valueIndex}
              </span>
              <span className="flex h-10.5 flex-col items-center font-mono text-index leading-3.5 text-secondary">
                {pointers
                  .filter((pointer) => pointer.position === valueIndex)
                  .map((pointer) => (
                    <span
                      key={pointer.name}
                      data-pointer={pointer.name}
                      className="data-[pointer=mid]:font-medium data-[pointer=mid]:text-accent-text"
                    >
                      {pointer.name}
                    </span>
                  ))}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
