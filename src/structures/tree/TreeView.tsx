import { Legend, type LegendItem } from "@/components/Legend";
import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  type NodeTone,
} from "../diagram/Diagram";
import { findPathTo } from "./binarySearchTree";
import { layoutTree } from "./treeLayout";
import type { TreeState } from "./treeState";

const legendItems: readonly LegendItem[] = [
  { label: "current", swatchClassName: "bg-accent" },
  { label: "pending", swatchClassName: "bg-pending" },
  { label: "removing", swatchClassName: "bg-danger" },
];

interface TreeViewProps {
  state: TreeState;
}

export function TreeView({ state }: TreeViewProps) {
  const { nodes, edges } = layoutTree(state.root);
  const focusedPath =
    state.focusedNodeId === null
      ? []
      : findPathTo(state.root, state.focusedNodeId);

  function toneOf(nodeId: string): NodeTone {
    if (nodeId === state.markedNodeId) return "danger";
    if (nodeId === state.focusedNodeId) return "current";
    return "pending";
  }

  return (
    <div className="relative size-full px-4 pt-10 pb-2">
      <Legend items={legendItems} />
      <Diagram label="Binary search tree" points={nodes}>
        {edges.map(({ parent, child }) => (
          <DiagramEdge
            key={child.id}
            from={parent}
            to={child}
            isHighlighted={focusedPath.includes(child.id)}
          />
        ))}
        {nodes.map((node) => (
          <DiagramNode
            key={node.id}
            position={node}
            label={String(node.value)}
            tone={toneOf(node.id)}
          />
        ))}
      </Diagram>
    </div>
  );
}
