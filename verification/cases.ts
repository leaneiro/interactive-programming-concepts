import type { Step } from "@/algorithms/algorithm";
import { bstDelete } from "@/algorithms/bst-delete";
import { traceBstDelete } from "@/algorithms/bst-delete/trace";
import { bstInsert } from "@/algorithms/bst-insert";
import { traceBstInsert } from "@/algorithms/bst-insert/trace";
import { bstSearch } from "@/algorithms/bst-search";
import { traceBstSearch } from "@/algorithms/bst-search/trace";
import { bubbleSort } from "@/algorithms/bubble-sort";
import { traceBubbleSort } from "@/algorithms/bubble-sort/trace";
import { breadthFirstSearch } from "@/algorithms/graph-bfs";
import { traceBreadthFirstSearch } from "@/algorithms/graph-bfs/trace";
import { selectionSort } from "@/algorithms/selection-sort";
import { traceSelectionSort } from "@/algorithms/selection-sort/trace";
import { twoSum } from "@/algorithms/two-sum";
import { traceTwoSum } from "@/algorithms/two-sum/trace";
import { unionFind } from "@/algorithms/union-find";
import {
  traceUnionFind,
  type ElementPair,
} from "@/algorithms/union-find/trace";
import type { ArrayState } from "@/structures/array/arrayState";
import type { Graph } from "@/structures/graph/graph";
import {
  buildSearchTree,
  listValuesInOrder,
} from "@/structures/tree/binarySearchTree";
import {
  graphOf,
  integer,
  integers,
  pairsOf,
  text,
  tree,
  type AlgorithmVerification,
  type VerificationCase,
} from "./verification";

const arraysToSort = [
  [],
  [7],
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [5, 1, 5, 3, 1],
  [42, 7, 19, 3, 88, 61, 7, 15],
];

const balancedTreeValues = [50, 30, 70, 20, 40, 60, 80];
const deepTreeValues = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65, 10];

const layeredGraph: Graph = {
  nodes: ["A", "B", "C", "D", "E"],
  edges: [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "D"],
    ["D", "E"],
  ],
};

const cyclicGraph: Graph = {
  nodes: ["A", "B", "C", "D", "E", "F"],
  edges: [
    ["A", "B"],
    ["B", "C"],
    ["C", "A"],
    ["C", "D"],
    ["D", "E"],
    ["E", "F"],
    ["F", "D"],
  ],
};

function lastOf<Item>(items: readonly Item[]): Item {
  return items[items.length - 1];
}

function verifySorting(
  trace: (input: readonly number[]) => readonly Step<string, ArrayState>[],
): AlgorithmVerification {
  return {
    resultKind: "integers",
    cases: arraysToSort.map((input) => ({
      arguments: [integers(input)],
      expected: lastOf(trace(input)).state.values,
    })),
  };
}

function pairCase(values: readonly number[], target: number): VerificationCase {
  const steps = traceTwoSum({ values, target });

  return {
    arguments: [integers(values), integer(target)],
    expected: lastOf(steps).state.matchedIndices,
  };
}

function searchCase(
  values: readonly number[],
  target: number,
): VerificationCase {
  const steps = traceBstSearch({ root: buildSearchTree(values), target });

  return {
    arguments: [tree(values), integer(target)],
    expected: lastOf(steps).region === "found",
  };
}

function insertCase(
  values: readonly number[],
  value: number,
): VerificationCase {
  const steps = traceBstInsert({ root: buildSearchTree(values), value });

  return {
    arguments: [tree(values), integer(value)],
    expected: listValuesInOrder(lastOf(steps).state.root),
  };
}

function deleteCase(
  values: readonly number[],
  value: number,
): VerificationCase {
  const steps = traceBstDelete({ root: buildSearchTree(values), value });

  return {
    arguments: [tree(values), integer(value)],
    expected: listValuesInOrder(lastOf(steps).state.root),
  };
}

function searchOrderCase(graph: Graph, startNode: string): VerificationCase {
  const steps = traceBreadthFirstSearch({ graph, startNode });

  return {
    arguments: [graphOf(graph), text(startNode)],
    expected: lastOf(steps).state.visitOrder,
  };
}

function unionCase(
  elementCount: number,
  pairs: readonly ElementPair[],
): VerificationCase {
  const steps = traceUnionFind({ elementCount, pairs });

  return {
    arguments: [integer(elementCount), pairsOf(pairs)],
    expected: lastOf(steps).state.parent,
  };
}

export const verifications: ReadonlyMap<string, AlgorithmVerification> =
  new Map<string, AlgorithmVerification>([
    [bubbleSort.id, verifySorting(traceBubbleSort)],
    [selectionSort.id, verifySorting(traceSelectionSort)],
    [
      twoSum.id,
      {
        resultKind: "integers",
        cases: [
          pairCase([2, 7, 11, 15], 9),
          pairCase([3, 2, 4], 6),
          pairCase([3, 3], 6),
          pairCase([5, 1, 8, 3, 9, 4], 13),
          pairCase([-3, 4, 3, 90], 0),
          pairCase([1, 2, 3], 7),
          pairCase([], 5),
        ],
      },
    ],
    [
      bstSearch.id,
      {
        resultKind: "boolean",
        cases: [
          ...[50, 20, 60, 65, 5].map((target) =>
            searchCase(balancedTreeValues, target),
          ),
          searchCase([], 1),
        ],
      },
    ],
    [
      bstInsert.id,
      {
        resultKind: "treeInOrder",
        cases: [
          ...[10, 35, 65, 90, 40].map((value) =>
            insertCase(balancedTreeValues, value),
          ),
          insertCase([], 5),
        ],
      },
    ],
    [
      bstDelete.id,
      {
        resultKind: "treeInOrder",
        cases: [
          ...[10, 20, 60, 30, 50, 99].map((value) =>
            deleteCase(deepTreeValues, value),
          ),
          deleteCase([50, 30, 20, 10], 30),
          deleteCase([7], 7),
          deleteCase([], 1),
        ],
      },
    ],
    [
      unionFind.id,
      {
        resultKind: "integers",
        cases: [
          unionCase(1, []),
          unionCase(4, []),
          unionCase(4, [
            [0, 1],
            [2, 3],
          ]),
          unionCase(5, [
            [0, 1],
            [2, 1],
            [3, 4],
            [1, 4],
            [4, 0],
          ]),
          unionCase(6, [
            [5, 4],
            [4, 3],
            [3, 2],
            [2, 1],
            [1, 0],
            [0, 5],
          ]),
          unionCase(8, [
            [0, 1],
            [2, 3],
            [1, 3],
            [4, 5],
            [6, 7],
            [5, 7],
            [3, 7],
            [0, 6],
          ]),
        ],
      },
    ],
    [
      breadthFirstSearch.id,
      {
        resultKind: "texts",
        cases: [
          searchOrderCase(layeredGraph, "A"),
          searchOrderCase(layeredGraph, "D"),
          searchOrderCase(cyclicGraph, "A"),
          searchOrderCase(cyclicGraph, "E"),
        ],
      },
    ],
  ]);
