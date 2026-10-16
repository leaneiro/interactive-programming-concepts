import type { VisualState } from "@/structures/visualState";

const decorativeAddress = "0x7f3a…";

interface MemorySectionProps {
  state: VisualState;
}

export function MemorySection({ state }: MemorySectionProps) {
  switch (state.kind) {
    case "array":
      return (
        <MemoryRow
          label="Memory"
          detail={`${state.name}[${state.values.length}]`}
          note={decorativeAddress}
          cellSizing="fill"
          cells={state.values.map((value, valueIndex) => ({
            key: valueIndex,
            label: valueIndex,
            value,
            isActive: state.comparedIndices.includes(valueIndex),
          }))}
        />
      );
    case "graph":
      return (
        <MemoryRow
          label="Queue"
          detail={`queue[${state.queuedNodes.length}]`}
          cellSizing="fixed"
          cells={state.queuedNodes.map((node, position) => ({
            key: node,
            label: position,
            value: node,
            isActive: false,
          }))}
        />
      );
    case "forest":
      return (
        <MemoryRow
          label="Memory"
          detail={`${state.name}[${state.parent.length}]`}
          note={decorativeAddress}
          cellSizing="fill"
          cells={state.parent.map((parentElement, element) => ({
            key: element,
            label: element,
            value: parentElement,
            isActive: state.focusedElements.includes(element),
          }))}
        />
      );
    case "tree":
      return null;
  }
}

interface MemoryCell {
  key: string | number;
  label: string | number;
  value: string | number;
  isActive: boolean;
}

interface MemoryRowProps {
  label: string;
  detail: string;
  note?: string;
  cellSizing: "fill" | "fixed";
  cells: readonly MemoryCell[];
}

function MemoryRow({ label, detail, note, cellSizing, cells }: MemoryRowProps) {
  return (
    <section>
      <header className="flex justify-between px-4 pt-2.5 pb-1.5 section-label">
        <h2>
          {label} · <span className="normal-case">{detail}</span>
        </h2>
        {note !== undefined && (
          <span className="text-ghost normal-case">{note}</span>
        )}
      </header>
      <ol
        data-sizing={cellSizing}
        className="grid min-h-17.5 auto-cols-[3.25rem] grid-flow-col gap-2 overflow-x-auto px-4 pt-1.5 pb-3.5 font-mono text-cell data-[sizing=fill]:auto-cols-fr"
      >
        {cells.map((cell) => (
          <li
            key={cell.key}
            data-active={cell.isActive}
            className="group flex flex-col items-center gap-0.75 rounded-md bg-raised py-2.5 transition-colors duration-150 data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-on-accent"
          >
            <span className="text-index text-faded group-data-[active=true]:text-on-accent/70">
              {cell.label}
            </span>
            {cell.value}
          </li>
        ))}
      </ol>
    </section>
  );
}
