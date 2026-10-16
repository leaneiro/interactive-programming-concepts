import { Diagram, DiagramArc, DiagramCell } from "../diagram/Diagram";
import type { ForestState } from "./forestState";
import { isLinkToParentHighlighted, toneOfElement } from "./forestTone";
import { layoutParentArray } from "./parentArrayLayout";

interface ParentArrayProps {
  state: ForestState;
}

export function ParentArray({ state }: ParentArrayProps) {
  const { cells, arcs, outline } = layoutParentArray(state.parent);

  return (
    <Diagram label="Parent array" points={outline}>
      {cells.map((cell) => (
        <DiagramCell
          key={cell.element}
          position={cell}
          label={String(state.parent[cell.element])}
          caption={String(cell.element)}
          tone={toneOfElement(state, cell.element)}
        />
      ))}
      {arcs.map((arc) => (
        <DiagramArc
          key={arc.element}
          start={arc.start}
          end={arc.end}
          height={arc.height}
          isHighlighted={isLinkToParentHighlighted(state, arc.element)}
        />
      ))}
    </Diagram>
  );
}
