import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  type NodeTone,
} from "../diagram/Diagram";
import { findPathTo } from "./binarySearchTree";
import { layoutTree } from "./treeLayout";
import type { TreeState } from "./treeState";

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
    if (nodeId === state.focusedNodeId) return "accent";
    return "idle";
  }

  return (
    <figure className="panel p-2">
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
      <figcaption className="px-2 pb-1 font-mono text-sm">
        {state.caption}
      </figcaption>
    </figure>
  );
}
