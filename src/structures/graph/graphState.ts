import type { Graph, GraphEdge } from "./graph";

export interface GraphState {
  kind: "graph";
  graph: Graph;
  currentNode: string | null;
  visitedNodes: readonly string[];
  queuedNodes: readonly string[];
  exploredEdges: readonly GraphEdge[];
}
