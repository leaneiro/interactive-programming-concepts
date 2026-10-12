import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import {
  replaceNode,
  type ChildSide,
  type TreeNode,
} from "@/structures/tree/binarySearchTree";
import type { TreeState } from "@/structures/tree/treeState";

export type BstDeleteRegion =
  | "signature"
  | "notFound"
  | "compareLeft"
  | "recurseLeft"
  | "compareRight"
  | "recurseRight"
  | "found"
  | "removeLeaf"
  | "replaceWithRightChild"
  | "replaceWithLeftChild"
  | "findSuccessor"
  | "copySuccessor"
  | "removeSuccessor"
  | "returnNode";

export type BstDeleteVariable = "value" | "currentNode" | "successor";

export interface BstDeleteInput {
  root: TreeNode | null;
  value: number;
}

type BstDeleteStep = Step<BstDeleteRegion, TreeState, BstDeleteVariable>;

const directions = {
  left: { compare: "compareLeft", recurse: "recurseLeft", comparison: "<" },
  right: { compare: "compareRight", recurse: "recurseRight", comparison: ">" },
} as const;

export function traceBstDelete({
  root,
  value,
}: BstDeleteInput): BstDeleteStep[] {
  const steps: BstDeleteStep[] = [];
  const variables: Record<BstDeleteVariable, VariableValue> = {
    value,
    currentNode: null,
    successor: null,
  };
  let tree = root;
  let focusedNodeId: string | null = null;
  let markedNodeId: string | null = null;
  let comparisonCount = 0;

  function record({
    activeVariables = [],
    ...description
  }: StepDescription<BstDeleteRegion, BstDeleteVariable>): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [{ label: "cmp", value: comparisonCount }],
      state: { kind: "tree", root: tree, focusedNodeId, markedNodeId },
    });
  }

  function removeFrom(node: TreeNode | null, target: number): void {
    variables.value = target;

    if (node === null) {
      variables.currentNode = "null";
      record({
        region: "notFound",
        caption: rich`${code(target)} is not here`,
        historyEntry: "return null",
        activeVariables: ["currentNode"],
        explanation: rich`This subtree is empty (${linesOf("notFound")}), so ${code(target)} is not in the tree and nothing changes.`,
      });
      return;
    }

    focusedNodeId = node.id;
    variables.currentNode = node.value;
    comparisonCount++;

    record({
      region: "signature",
      caption: rich`visit ${code(node.value)}`,
      historyEntry: `visit(${node.value})`,
      activeVariables: ["currentNode"],
      explanation: rich`The function runs for the subtree whose root is ${code(node.value)} (${linesOf("signature")}).`,
    });

    if (target !== node.value) {
      const side: ChildSide = target < node.value ? "left" : "right";
      const direction = directions[side];
      const comparison = `${target} ${direction.comparison} ${node.value}`;

      record({
        region: direction.compare,
        caption: rich`${code(comparison)} → ${side}`,
        historyEntry: `cmp(${target},${node.value}) → ${side}`,
        activeVariables: ["currentNode"],
        explanation: rich`Since ${code(comparison)}, the value to remove can only be in the ${side} subtree of ${code(node.value)}.`,
      });
      record({
        region: direction.recurse,
        caption: rich`go into the ${side} subtree`,
        historyEntry: `bstDelete(${node.value}.${side}, ${target})`,
        activeVariables: ["currentNode"],
        explanation: rich`The function calls itself for the ${side} child (${linesOf(direction.recurse)}). Whatever that call returns becomes the ${side} child of ${code(node.value)}.`,
      });
      removeFrom(node[side], target);
      return;
    }

    markedNodeId = node.id;
    record({
      region: "found",
      caption: rich`found ${code(target)}`,
      historyEntry: `cmp(${target},${node.value}) → equal`,
      activeVariables: ["currentNode"],
      explanation: rich`This is the node to remove (${linesOf("found")}). What happens next depends on how many children it has.`,
    });

    if (node.left === null || node.right === null) {
      replaceWithOnlyChild(node, node.left ?? node.right);
      return;
    }

    let successor = node.right;
    focusedNodeId = successor.id;
    variables.successor = successor.value;

    record({
      region: "findSuccessor",
      caption: rich`two children → find the successor`,
      historyEntry: `successor = ${successor.value}`,
      activeVariables: ["successor"],
      explanation: rich`${code(target)} has two children, so it cannot simply be removed. Its successor, the smallest value in the right subtree, will take its place. The search for it starts at ${code(successor.value)}.`,
    });

    while (successor.left !== null) {
      successor = successor.left;
      focusedNodeId = successor.id;
      variables.successor = successor.value;

      record({
        region: "findSuccessor",
        caption: rich`go left to ${code(successor.value)}`,
        historyEntry: `successor = ${successor.value}`,
        activeVariables: ["successor"],
        explanation: rich`There is still a smaller value to the left, so the successor moves to ${code(successor.value)} (${linesOf("findSuccessor")}).`,
      });
    }

    tree = replaceNode(tree, node.id, { ...node, value: successor.value });
    focusedNodeId = node.id;
    markedNodeId = successor.id;
    variables.currentNode = successor.value;

    record({
      region: "copySuccessor",
      caption: rich`copy ${code(successor.value)} over ${code(target)}`,
      historyEntry: `root.value = ${successor.value}`,
      activeVariables: ["currentNode", "successor"],
      explanation: rich`The node keeps its position and its children but now holds the successor's value, ${code(successor.value)}. For a moment that value appears twice in the tree.`,
    });
    record({
      region: "removeSuccessor",
      caption: rich`remove the old ${code(successor.value)}`,
      historyEntry: `bstDelete(root.right, ${successor.value})`,
      activeVariables: ["successor"],
      explanation: rich`The original ${code(successor.value)} is deleted from the right subtree with a recursive call (${linesOf("removeSuccessor")}). It has no left child, so this ends in one of the simple cases.`,
    });

    removeFrom(node.right, successor.value);
  }

  function replaceWithOnlyChild(
    node: TreeNode,
    onlyChild: TreeNode | null,
  ): void {
    tree = replaceNode(tree, node.id, onlyChild);
    markedNodeId = null;
    focusedNodeId = onlyChild?.id ?? null;

    if (onlyChild === null) {
      record({
        region: "removeLeaf",
        caption: rich`leaf → remove ${code(node.value)}`,
        historyEntry: `remove(${node.value})`,
        explanation: rich`${code(node.value)} has no children, so the function returns ${code("null")} and the parent simply loses this child (${linesOf("removeLeaf")}).`,
      });
      return;
    }

    const childSide: ChildSide = node.left === null ? "right" : "left";

    record({
      region:
        childSide === "right"
          ? "replaceWithRightChild"
          : "replaceWithLeftChild",
      caption: rich`one child → ${code(onlyChild.value)} moves up`,
      historyEntry: `${node.value} ← ${onlyChild.value}`,
      explanation: rich`${code(node.value)} only has a ${childSide} child, so that child is returned and takes its place. The subtree below ${code(onlyChild.value)} comes along untouched.`,
    });
  }

  record({
    region: "signature",
    caption: rich`delete ${code(value)}`,
    historyEntry: `bstDelete(root, ${value})`,
    explanation: rich`Deleting has two parts: find the node, then repair the tree. The repair depends on how many children the node has.`,
  });

  removeFrom(root, value);
  variables.value = value;

  record({
    region: "returnNode",
    caption: rich`done`,
    historyEntry: "return root",
    explanation: rich`Each call returns its own root on the way back up (${linesOf("returnNode")}), so the caller receives the repaired tree.`,
  });

  return steps;
}
