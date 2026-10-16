import type { ForestUnion } from "./forestState";

interface UnionListProps {
  unions: readonly ForestUnion[];
}

export function UnionList({ unions }: UnionListProps) {
  return (
    <ol
      aria-label="Unions"
      className="flex min-w-0 flex-wrap gap-1.5 font-mono text-meta"
    >
      {unions.map((union, unionIndex) => (
        <li
          key={unionIndex}
          data-status={union.status}
          title={
            union.status === "skipped" ? "Already in the same set" : undefined
          }
          className="rounded-md bg-raised px-2 py-1 text-secondary transition-colors duration-150 data-[status=current]:bg-accent data-[status=current]:font-medium data-[status=current]:text-on-accent data-[status=linked]:bg-transparent data-[status=linked]:text-faded data-[status=skipped]:bg-transparent data-[status=skipped]:text-faded data-[status=skipped]:line-through"
        >
          union({union.first},{union.second})
        </li>
      ))}
    </ol>
  );
}
