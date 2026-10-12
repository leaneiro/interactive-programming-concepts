import type { ArrayState } from "./arrayState";

interface ArrayViewProps {
  state: ArrayState;
}

export function ArrayView({ state }: ArrayViewProps) {
  const largestValue = Math.max(1, ...state.values);

  return (
    <ol
      aria-label="Array values"
      className="flex h-72 gap-[3%] panel px-[3%] py-3 font-mono text-xs"
    >
      {state.values.map((value, valueIndex) => {
        const isHighlighted = state.highlightedIndices.includes(valueIndex);

        return (
          <li
            key={valueIndex}
            className="flex min-w-0 flex-1 flex-col gap-1.5 text-center"
          >
            <div className="relative mt-5 flex-1">
              <div
                data-highlighted={isHighlighted}
                style={{ height: `${(value / largestValue) * 100}%` }}
                className="absolute inset-x-0 bottom-0 rounded-t bg-idle shadow-md transition-colors data-[highlighted=true]:bg-accent"
              >
                <span className="absolute inset-x-0 -top-5">{value}</span>
              </div>
            </div>
            <span className="text-muted">{valueIndex}</span>
          </li>
        );
      })}
    </ol>
  );
}
