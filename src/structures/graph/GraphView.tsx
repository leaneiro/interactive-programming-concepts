import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  type NodeTone,
} from "../diagram/Diagram";
import { connects } from "./graph";
import { layoutGraph } from "./graphLayout";
import type { GraphState } from "./graphState";

interface GraphViewProps {
  state: GraphState;
}

export function GraphView({ state }: GraphViewProps) {
  const { nodes, edges } = layoutGraph(state.graph);

  function toneOf(nodeName: string): NodeTone {
    if (nodeName === state.currentNode) return "accent";
    if (state.queuedNodes.includes(nodeName)) return "warning";
    if (state.visitedNodes.includes(nodeName)) return "success";
    return "idle";
  }

  return (
    <figure className="panel p-2">
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
      <figcaption className="px-2 pb-1 font-mono text-sm">
        Queue:{" "}
        <span className="font-semibold text-warning">
          [{state.queuedNodes.join(", ")}]
        </span>
      </figcaption>
    </figure>
  );
}
