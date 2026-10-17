import { Legend, type LegendItem } from "@/components/Legend";
import type { HashMapEntry, HashMapState } from "./hashMapState";

const legendItems: readonly LegendItem[] = [
  { label: "current", swatchClassName: "bg-accent" },
  { label: "stored", swatchClassName: "bg-waiting" },
  { label: "match", swatchClassName: "bg-sorted" },
];

interface HashMapViewProps {
  state: HashMapState;
}

export function HashMapView({ state }: HashMapViewProps) {
  const storedIndices = state.entries.map((entry) => entry.value);

  function statusOfIndex(valueIndex: number): string {
    if (state.matchedIndices.includes(valueIndex)) return "match";
    if (valueIndex === state.currentIndex) return "current";
    if (storedIndices.includes(valueIndex)) return "stored";
    return "pending";
  }

  function statusOfEntry(entry: HashMapEntry): string {
    if (state.lookup?.isFound === true && state.lookup.key === entry.key) {
      return "match";
    }
    if (entry.key === state.newestKey) return "newest";
    return "stored";
  }

  return (
    <div className="relative flex size-full flex-col justify-center gap-8 px-4 pt-12 pb-6 sm:px-9">
      <Legend items={legendItems} />

      <section aria-label="Array" className="flex flex-col gap-2.5">
        <h3 className="section-label normal-case">{state.arrayName}</h3>
        <ol className="grid auto-cols-fr grid-flow-col gap-1.5 sm:gap-2.5">
          {state.values.map((value, valueIndex) => (
            <li
              key={valueIndex}
              className="flex min-w-0 flex-col items-center gap-1.5"
            >
              <span
                data-status={statusOfIndex(valueIndex)}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-raised font-mono text-counter text-foreground transition-colors duration-200 data-[status=current]:bg-accent data-[status=current]:font-medium data-[status=current]:text-on-accent data-[status=match]:bg-sorted data-[status=match]:font-medium data-[status=match]:text-surface data-[status=stored]:bg-waiting data-[status=stored]:text-surface sm:h-14"
              >
                {value}
              </span>
              <span className="font-mono text-index text-faded">
                {valueIndex}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Hash map" className="flex flex-col gap-2.5">
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="section-label normal-case">{state.mapName}</h3>
          {state.lookup !== null && (
            <p
              data-found={state.lookup.isFound}
              className="group font-mono text-meta text-tertiary"
            >
              looking for{" "}
              <span className="font-medium text-accent-text">
                {state.lookup.key}
              </span>
              {" → "}
              <span className="text-faded group-data-[found=true]:font-medium group-data-[found=true]:text-sorted">
                {state.lookup.isFound ? "found" : "not there"}
              </span>
            </p>
          )}
        </header>
        <ol className="flex min-h-10 flex-wrap gap-2 font-mono text-body">
          {state.entries.length === 0 && (
            <li className="flex items-center text-faded">empty</li>
          )}
          {state.entries.map((entry) => (
            <li
              key={entry.key}
              data-status={statusOfEntry(entry)}
              className="group flex items-center gap-1.5 rounded-lg border border-transparent bg-raised px-3 py-2 text-foreground transition-colors duration-200 data-[status=match]:bg-sorted data-[status=match]:text-surface data-[status=newest]:border-accent data-[status=newest]:text-accent-text"
            >
              <span className="font-medium">{entry.key}</span>
              <span className="text-faded group-data-[status=match]:text-surface/70">
                →
              </span>
              <span>{entry.value}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
