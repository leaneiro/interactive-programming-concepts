import {
  emptyReference,
  type Step,
  type StepDescription,
  type VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type { TreeNode } from "@/structures/tree/binarySearchTree";
import type { TreeState } from "@/structures/tree/treeState";

export type BstSearchRegion =
  "signature" | "loop" | "found" | "goLeft" | "goRight" | "notFound";

export type BstSearchVariable = "target" | "currentNode";

export interface BstSearchInput {
  root: TreeNode | null;
  target: number;
}

type BstSearchStep = Step<BstSearchRegion, TreeState, BstSearchVariable>;

export function traceBstSearch({
  root,
  target,
}: BstSearchInput): BstSearchStep[] {
  const steps: BstSearchStep[] = [];
  const variables: Record<BstSearchVariable, VariableValue> = {
    target,
    currentNode: null,
  };
  let focusedNodeId: string | null = null;
  let comparisonCount = 0;

  function record({
    activeVariables = [],
    ...description
  }: StepDescription<BstSearchRegion, BstSearchVariable>): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [{ label: "cmp", value: comparisonCount }],
      state: { kind: "tree", root, focusedNodeId, markedNodeId: null },
    });
  }

  record({
    region: "signature",
    caption: rich`look for ${code(target)}`,
    historyEntry: `bstSearch(root, ${target})`,
    explanation: rich`A binary search tree keeps smaller values to the left of every node and larger values to the right, so each comparison discards a whole subtree. The search starts at the root.`,
  });

  let node = root;
  while (node !== null) {
    focusedNodeId = node.id;
    variables.currentNode = node.value;
    comparisonCount++;

    record({
      region: "loop",
      caption: rich`visit ${code(node.value)}`,
      historyEntry: `visit(${node.value})`,
      activeVariables: ["currentNode"],
      explanation: rich`There is a node to check (${linesOf("loop")}): the search is now at ${code(node.value)}.`,
    });

    if (target === node.value) {
      record({
        region: "found",
        caption: rich`${code(`${target} = ${node.value}`)} → found`,
        historyEntry: `cmp(${target},${node.value}) → found`,
        activeVariables: ["currentNode"],
        explanation: rich`The target ${code(target)} is equal to the value in this node, so the search is over: the value is in the tree.`,
      });
      return steps;
    }

    if (target < node.value) {
      record({
        region: "goLeft",
        caption: rich`${code(`${target} < ${node.value}`)} → left`,
        historyEntry: `cmp(${target},${node.value}) → left`,
        activeVariables: ["currentNode"],
        explanation: rich`${code(target)} is smaller than ${code(node.value)}, so if it exists it can only be in the left subtree. Everything to the right is discarded.`,
      });
      node = node.left;
    } else {
      record({
        region: "goRight",
        caption: rich`${code(`${target} > ${node.value}`)} → right`,
        historyEntry: `cmp(${target},${node.value}) → right`,
        activeVariables: ["currentNode"],
        explanation: rich`${code(target)} is larger than ${code(node.value)}, so if it exists it can only be in the right subtree. Everything to the left is discarded.`,
      });
      node = node.right;
    }
  }

  variables.currentNode = emptyReference;

  record({
    region: "notFound",
    caption: rich`${code(target)} is not here`,
    historyEntry: "not found",
    activeVariables: ["currentNode"],
    explanation: rich`The search ran out of nodes: there is nowhere left to look, so ${code(target)} is not in the tree.`,
  });

  return steps;
}
