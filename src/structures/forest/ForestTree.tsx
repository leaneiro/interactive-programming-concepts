import { Diagram, DiagramEdge, DiagramNode } from "../diagram/Diagram";
import { layoutForest } from "./forestLayout";
import type { ForestState } from "./forestState";
import { isLinkToParentHighlighted, toneOfElement } from "./forestTone";

interface ForestTreeProps {
  state: ForestState;
}

export function ForestTree({ state }: ForestTreeProps) {
  const { nodes, edges } = layoutForest(state.parent);

  return (
    <Diagram label="Disjoint-set forest" points={nodes}>
      {edges.map(({ parent, child }) => (
        <DiagramEdge
          key={child.element}
          from={parent}
          to={child}
          isHighlighted={isLinkToParentHighlighted(state, child.element)}
        />
      ))}
      {nodes.map((node) => (
        <DiagramNode
          key={node.element}
          position={node}
          label={String(node.element)}
          tone={toneOfElement(state, node.element)}
        />
      ))}
    </Diagram>
  );
}
