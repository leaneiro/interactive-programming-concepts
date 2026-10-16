import type { Point } from "../diagram/geometry";

const columnWidth = 52;
const rowHeight = 64;
const columnsBetweenTrees = 0.5;

export interface PositionedForestNode extends Point {
  element: number;
}

export interface PositionedForestEdge {
  parent: PositionedForestNode;
  child: PositionedForestNode;
}

export interface ForestLayout {
  nodes: PositionedForestNode[];
  edges: PositionedForestEdge[];
}

export function layoutForest(parent: readonly number[]): ForestLayout {
  const childrenOf = parent.map((): number[] => []);
  const roots: number[] = [];

  for (const [element, parentElement] of parent.entries()) {
    if (parentElement === element) {
      roots.push(element);
    } else {
      childrenOf[parentElement].push(element);
    }
  }

  const nodes: PositionedForestNode[] = [];
  const edges: PositionedForestEdge[] = [];
  let nextColumn = 0;

  function placeSubtree(element: number, depth: number): PositionedForestNode {
    const children = childrenOf[element].map((child) =>
      placeSubtree(child, depth + 1),
    );
    const x =
      children.length === 0
        ? nextColumn++ * columnWidth
        : (children[0].x + children[children.length - 1].x) / 2;
    const positionedNode = { element, x, y: depth * rowHeight };

    nodes.push(positionedNode);
    for (const child of children) {
      edges.push({ parent: positionedNode, child });
    }

    return positionedNode;
  }

  for (const root of roots) {
    placeSubtree(root, 0);
    nextColumn += columnsBetweenTrees;
  }

  return { nodes, edges };
}
