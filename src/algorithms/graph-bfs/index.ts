import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomConnectedGraph } from "@/structures/graph/randomGraph";
import { traceBreadthFirstSearch, type BreadthFirstSearchInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

function createInput(): BreadthFirstSearchInput {
  const graph = createRandomConnectedGraph();

  return { graph, startNode: graph.nodes[0] };
}

export const breadthFirstSearch = defineAlgorithm({
  id: "graph-bfs",
  name: "BFS",
  category: "graphs",
  complexity: "O(V + E)",
  traits: ["breadth-first search"],
  createInput,
  trace: traceBreadthFirstSearch,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 4),
        enqueueStart: lines(6, 7),
        whileLoop: line(9),
        dequeue: line(10),
        visit: line(11),
        forEachNeighbor: line(13),
        checkVisited: line(14),
        markVisited: line(15),
        enqueue: line(16),
        returnResult: line(20),
      },
      variableNames: {
        startNode: "start",
        currentNode: "current",
        neighbor: "neighbor",
        result: "result",
      },
    },
  ],
});
