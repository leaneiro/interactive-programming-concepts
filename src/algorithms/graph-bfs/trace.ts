import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
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

export type BreadthFirstSearchVariable =
  "startNode" | "currentNode" | "neighbor" | "result";

export interface BreadthFirstSearchInput {
  graph: Graph;
  startNode: string;
}

type BreadthFirstSearchStep = Step<
  BreadthFirstSearchRegion,
  GraphState,
  BreadthFirstSearchVariable
>;

export function traceBreadthFirstSearch({
  graph,
  startNode,
}: BreadthFirstSearchInput): BreadthFirstSearchStep[] {
  const steps: BreadthFirstSearchStep[] = [];
  const visitedNodes = new Set<string>();
  const queue: string[] = [];
  const visitOrder: string[] = [];
  const exploredEdges: GraphEdge[] = [];
  const variables: Record<BreadthFirstSearchVariable, VariableValue> = {
    startNode,
    currentNode: null,
    neighbor: null,
    result: "[]",
  };
  let currentNode: string | null = null;

  function record({
    activeVariables = [],
    ...description
  }: StepDescription<
    BreadthFirstSearchRegion,
    BreadthFirstSearchVariable
  >): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [{ label: "visited", value: visitOrder.length }],
      state: {
        kind: "graph",
        graph,
        currentNode,
        visitedNodes: [...visitedNodes],
        queuedNodes: [...queue],
        visitOrder: [...visitOrder],
        exploredEdges: [...exploredEdges],
      },
    });
  }

  record({
    region: "signature",
    caption: rich`start at ${code(startNode)}`,
    historyEntry: `bfs(graph, ${startNode})`,
    explanation: rich`Breadth-first search explores a graph in layers: first the start node, then all of its neighbors, then their neighbors. A queue keeps the nodes that are waiting for their turn.`,
  });
  record({
    region: "initialize",
    caption: rich`empty set, queue and result`,
    historyEntry: "visited = {}, queue = []",
    explanation: rich`Three structures are created (${linesOf("initialize")}): the set of nodes already seen, the queue of nodes waiting to be processed, and the list with the visit order.`,
  });

  visitedNodes.add(startNode);
  queue.push(startNode);

  record({
    region: "enqueueStart",
    caption: rich`${code(startNode)} → queue`,
    historyEntry: `enqueue(${startNode})`,
    activeVariables: ["startNode"],
    explanation: rich`The start node ${code(startNode)} is marked as seen and placed in the queue, so the loop has something to begin with.`,
  });

  while (queue.length > 0) {
    variables.neighbor = null;

    record({
      region: "whileLoop",
      caption: rich`queue: ${code(queue.join(", "))}`,
      historyEntry: `queue = [${queue.join(", ")}]`,
      explanation: rich`The queue is not empty (${linesOf("whileLoop")}), so there are still nodes to process.`,
    });

    const node = queue[0];
    queue.shift();
    currentNode = node;
    variables.currentNode = node;

    record({
      region: "dequeue",
      caption: rich`take ${code(node)} from the queue`,
      historyEntry: `dequeue() → ${node}`,
      activeVariables: ["currentNode"],
      explanation: rich`${code(node)} leaves the front of the queue. It is the node that has waited the longest, which is what keeps the exploration in layers.`,
    });

    visitOrder.push(node);
    variables.result = `[${visitOrder.join(", ")}]`;

    record({
      region: "visit",
      caption: rich`visit ${code(node)}`,
      historyEntry: `result.push(${node})`,
      activeVariables: ["currentNode", "result"],
      explanation: rich`${code(node)} is added to the result (${linesOf("visit")}). Next, each of its neighbors is checked.`,
    });

    for (const neighbor of neighborsOf(graph, node)) {
      exploredEdges.push([node, neighbor]);
      variables.neighbor = neighbor;

      record({
        region: "forEachNeighbor",
        caption: rich`edge ${code(`${node} – ${neighbor}`)}`,
        historyEntry: `edge(${node},${neighbor})`,
        activeVariables: ["neighbor"],
        explanation: rich`The loop reaches ${code(neighbor)}, a neighbor of ${code(node)} (${linesOf("forEachNeighbor")}).`,
      });

      if (visitedNodes.has(neighbor)) {
        record({
          region: "checkVisited",
          caption: rich`${code(neighbor)} already seen → skip`,
          historyEntry: `seen(${neighbor}) → skip`,
          activeVariables: ["neighbor"],
          explanation: rich`${code(neighbor)} is already in the visited set, which means it was queued before. It is skipped so that no node is processed twice.`,
        });
        continue;
      }

      record({
        region: "checkVisited",
        caption: rich`${code(neighbor)} is new`,
        historyEntry: `seen(${neighbor}) → new`,
        activeVariables: ["neighbor"],
        explanation: rich`${code(neighbor)} is not in the visited set yet (${linesOf("checkVisited")}), so it will be marked and queued.`,
      });

      visitedNodes.add(neighbor);

      record({
        region: "markVisited",
        caption: rich`mark ${code(neighbor)} as seen`,
        historyEntry: `visited.add(${neighbor})`,
        activeVariables: ["neighbor"],
        explanation: rich`${code(neighbor)} is marked right away, before it is processed. That is what prevents it from entering the queue a second time.`,
      });

      queue.push(neighbor);

      record({
        region: "enqueue",
        caption: rich`${code(neighbor)} → queue`,
        historyEntry: `enqueue(${neighbor})`,
        activeVariables: ["neighbor"],
        explanation: rich`${code(neighbor)} goes to the back of the queue and will be processed after the nodes that are already waiting.`,
      });
    }
  }

  currentNode = null;
  variables.currentNode = null;
  variables.neighbor = null;

  record({
    region: "whileLoop",
    caption: rich`queue is empty`,
    historyEntry: "queue = []",
    explanation: rich`The queue is empty, so every node that can be reached from ${code(startNode)} has been processed.`,
  });
  record({
    region: "returnResult",
    caption: rich`order: ${code(visitOrder.join(", "))}`,
    historyEntry: "return result",
    explanation: rich`The function returns the nodes in the order they were visited: ${code(visitOrder.join(", "))}.`,
  });

  return steps;
}
