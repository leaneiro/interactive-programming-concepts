import { Legend, type LegendItem } from "@/components/Legend";
import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  type NodeTone,
} from "../diagram/Diagram";
import { connects } from "./graph";
import { layoutGraph } from "./graphLayout";
import type { GraphState } from "./graphState";

const legendItems: readonly LegendItem[] = [
  { label: "current", swatchClassName: "bg-accent" },
  { label: "queued", swatchClassName: "bg-waiting" },
  { label: "visited", swatchClassName: "bg-sorted" },
  { label: "pending", swatchClassName: "bg-pending" },
];

interface GraphViewProps {
  state: GraphState;
}

export function GraphView({ state }: GraphViewProps) {
  const { nodes, edges } = layoutGraph(state.graph);

  function toneOf(nodeName: string): NodeTone {
    if (nodeName === state.currentNode) return "current";
    if (state.visitOrder.includes(nodeName)) return "done";
    if (state.visitedNodes.includes(nodeName)) return "waiting";
    return "pending";
  }

  return (
    <div className="relative size-full px-4 pt-10 pb-2">
      <Legend items={legendItems} />
      <Diagram label="Graph" points={nodes}>
        {edges.map(({ firstNode, secondNode }) => (
          <DiagramEdge
            key={`${firstNode.name}-${secondNode.name}`}
            from={firstNode}
            to={secondNode}
            isHighlighted={state.exploredEdges.some((exploredEdge) =>
              connects(exploredEdge, firstNode.name, secondNode.name),
            )}
          />
        ))}
        {nodes.map((node) => (
          <DiagramNode
            key={node.name}
            position={node}
            label={node.name}
            tone={toneOf(node.name)}
          />
        ))}
      </Diagram>
    </div>
  );
}
