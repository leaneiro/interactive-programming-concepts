import type { Step } from "@/algorithms/algorithm";
import {
  neighborsOf,
  type Graph,
  type GraphEdge,
} from "@/structures/graph/graph";
import type { GraphState } from "@/structures/graph/graphState";

export type BreadthFirstSearchRegion =
  | "signature"
  | "initialize"
  | "enqueueStart"
  | "whileLoop"
  | "dequeue"
  | "visit"
  | "forEachNeighbor"
  | "checkVisited"
  | "markVisited"
  | "enqueue"
  | "returnResult";

export interface BreadthFirstSearchInput {
  graph: Graph;
  startNode: string;
}

type BreadthFirstSearchStep = Step<BreadthFirstSearchRegion, GraphState>;

export function traceBreadthFirstSearch({
  graph,
  startNode,
}: BreadthFirstSearchInput): BreadthFirstSearchStep[] {
  const steps: BreadthFirstSearchStep[] = [];
  const visitedNodes = new Set<string>();
  const queue: string[] = [];
  const visitOrder: string[] = [];
  const exploredEdges: GraphEdge[] = [];
  let currentNode: string | null = null;

  function record(region: BreadthFirstSearchRegion, note: string): void {
    steps.push({
      region,
      note,
      state: {
        kind: "graph",
        graph,
        currentNode,
        visitedNodes: [...visitedNodes],
        queuedNodes: [...queue],
        exploredEdges: [...exploredEdges],
      },
    });
  }

  record("signature", `Start a breadth-first search from ${startNode}`);
  record("initialize", "Create an empty visited set, queue and result list");

  visitedNodes.add(startNode);
  queue.push(startNode);
  record(
    "enqueueStart",
    `Mark ${startNode} as visited and add it to the queue`,
  );

  while (queue.length > 0) {
    record("whileLoop", `The queue still has nodes: ${queue.join(", ")}`);

    const node = queue[0];
    queue.shift();
    currentNode = node;
    record("dequeue", `Take ${node} from the front of the queue`);

    visitOrder.push(node);
    record("visit", `Visit ${node} and add it to the result`);

    for (const neighbor of neighborsOf(graph, node)) {
      exploredEdges.push([node, neighbor]);
      record("forEachNeighbor", `Follow the edge from ${node} to ${neighbor}`);

      if (visitedNodes.has(neighbor)) {
        record("checkVisited", `${neighbor} was already visited, skip it`);
        continue;
      }

      record("checkVisited", `${neighbor} has not been visited yet`);
      visitedNodes.add(neighbor);
      record("markVisited", `Mark ${neighbor} as visited`);
      queue.push(neighbor);
      record("enqueue", `Add ${neighbor} to the back of the queue`);
    }
  }

  currentNode = null;
  record("whileLoop", "The queue is empty, so the search is over");
  record("returnResult", `Return the visit order: ${visitOrder.join(", ")}`);

  return steps;
}
