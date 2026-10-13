import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomConnectedGraph } from "@/structures/graph/randomGraph";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import pythonCode from "./python.txt?raw";
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
    {
      languageId: "python",
      code: pythonCode,
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
        returnResult: line(17),
      },
      variableNames: {
        startNode: "start",
        currentNode: "current",
        neighbor: "neighbor",
        result: "result",
      },
    },
    {
      languageId: "java",
      code: javaCode,
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
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 4),
        enqueueStart: lines(6, 7),
        whileLoop: line(9),
        dequeue: lines(10, 11),
        visit: line(12),
        forEachNeighbor: line(14),
        checkVisited: line(15),
        markVisited: line(16),
        enqueue: line(17),
        returnResult: line(21),
      },
      variableNames: {
        startNode: "start",
        currentNode: "current",
        neighbor: "neighbor",
        result: "result",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 4),
        enqueueStart: lines(6, 7),
        whileLoop: line(9),
        dequeue: lines(10, 11),
        visit: line(12),
        forEachNeighbor: line(14),
        checkVisited: line(15),
        markVisited: line(16),
        enqueue: line(17),
        returnResult: line(21),
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
