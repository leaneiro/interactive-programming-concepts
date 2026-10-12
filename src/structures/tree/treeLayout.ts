import type { Point } from "../diagram/geometry";
import type { TreeNode } from "./binarySearchTree";

const columnWidth = 52;
const rowHeight = 64;

export interface PositionedTreeNode extends Point {
  id: string;
  value: number;
}

export interface PositionedTreeEdge {
  parent: PositionedTreeNode;
  child: PositionedTreeNode;
}

export interface TreeLayout {
  nodes: PositionedTreeNode[];
  edges: PositionedTreeEdge[];
}

export function layoutTree(root: TreeNode | null): TreeLayout {
  const nodes: PositionedTreeNode[] = [];
  const edges: PositionedTreeEdge[] = [];

  function placeSubtree(
    node: TreeNode | null,
    depth: number,
  ): PositionedTreeNode | null {
    if (node === null) return null;

    const leftChild = placeSubtree(node.left, depth + 1);
    const positionedNode: PositionedTreeNode = {
      id: node.id,
      value: node.value,
      x: nodes.length * columnWidth,
      y: depth * rowHeight,
    };
    nodes.push(positionedNode);
    const rightChild = placeSubtree(node.right, depth + 1);

    for (const child of [leftChild, rightChild]) {
      if (child !== null) edges.push({ parent: positionedNode, child });
    }

    return positionedNode;
  }

  placeSubtree(root, 0);

  return { nodes, edges };
}
