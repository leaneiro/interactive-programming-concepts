import { useEffect, useRef } from "react";
import type { Step } from "@/algorithms/algorithm";

interface HistorySectionProps {
  steps: readonly Step[];
  stepIndex: number;
  onSelectStep: (stepIndex: number) => void;
}

export function HistorySection({
  steps,
  stepIndex,
  onSelectStep,
}: HistorySectionProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const currentEntryRef = useRef<HTMLLIElement>(null);
  const numberWidth = String(steps.length).length;

  useEffect(() => {
    const list = listRef.current;
    const currentEntry = currentEntryRef.current;
    if (list === null || currentEntry === null) return;

    const entryCenter = currentEntry.offsetTop + currentEntry.offsetHeight / 2;
    list.scrollTop = entryCenter - list.clientHeight / 2;
  }, [stepIndex, steps]);

  return (
    <section className="flex flex-col @[34.5rem]:min-h-0">
      <h2 className="px-4 pt-2.5 pb-1.5 section-label">History</h2>
      <ol
        ref={listRef}
        className="relative max-h-64 flex-1 overflow-y-auto pb-2.5 font-mono text-meta leading-[1.85] @[34.5rem]:max-h-none @[34.5rem]:min-h-0"
      >
        {steps.map((step, entryIndex) => (
          <li
            key={entryIndex}
            ref={entryIndex === stepIndex ? currentEntryRef : null}
          >
            <button
              type="button"
              aria-current={entryIndex === stepIndex ? "step" : undefined}
              data-position={describeEntryPosition(entryIndex, stepIndex)}
              onClick={() => {
                onSelectStep(entryIndex);
              }}
              className="group flex w-full cursor-pointer gap-3 px-4 text-left text-ghost hover:bg-hover data-[position=current]:bg-accent-tint data-[position=current]:text-foreground data-[position=past]:text-faded"
            >
              <span className="group-data-[position=current]:text-accent-text">
                {String(entryIndex + 1).padStart(numberWidth, "0")}
              </span>
              <span className="truncate">{step.historyEntry}</span>
              <span className="ml-auto hidden text-accent-text group-data-[position=current]:inline">
                ●
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function describeEntryPosition(entryIndex: number, stepIndex: number): string {
  if (entryIndex === stepIndex) return "current";
  return entryIndex < stepIndex ? "past" : "future";
}
