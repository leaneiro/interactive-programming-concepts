export type GraphEdge = readonly [firstNode: string, secondNode: string];

export interface Graph {
  nodes: readonly string[];
  edges: readonly GraphEdge[];
}

export function connects(
  edge: GraphEdge,
  firstNode: string,
  secondNode: string,
): boolean {
  const [edgeStart, edgeEnd] = edge;

  return (
    (edgeStart === firstNode && edgeEnd === secondNode) ||
    (edgeStart === secondNode && edgeEnd === firstNode)
  );
}

export function neighborsOf(graph: Graph, node: string): string[] {
  return graph.edges.flatMap(([firstNode, secondNode]) => {
    if (firstNode === node) return [secondNode];
    if (secondNode === node) return [firstNode];
    return [];
  });
}
