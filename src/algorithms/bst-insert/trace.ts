import {
  emptyReference,
  type Step,
  type StepDescription,
  type VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import {
  createLeaf,
  replaceNode,
  withChild,
  type ChildSide,
  type TreeNode,
} from "@/structures/tree/binarySearchTree";
import type { TreeState } from "@/structures/tree/treeState";

export type BstInsertRegion =
  | "signature"
  | "createNode"
  | "compareLeft"
  | "recurseLeft"
  | "compareRight"
  | "recurseRight"
  | "returnNode";

export type BstInsertVariable = "value" | "currentNode";

export interface BstInsertInput {
  root: TreeNode | null;
  value: number;
}

type BstInsertStep = Step<BstInsertRegion, TreeState, BstInsertVariable>;

const directions = {
  left: { compare: "compareLeft", recurse: "recurseLeft", comparison: "<" },
  right: { compare: "compareRight", recurse: "recurseRight", comparison: ">" },
} as const;

export function traceBstInsert({
  root,
  value,
}: BstInsertInput): BstInsertStep[] {
  const steps: BstInsertStep[] = [];
  const variables: Record<BstInsertVariable, VariableValue> = {
    value,
    currentNode: null,
  };
  let tree = root;
  let focusedNodeId: string | null = null;
  let comparisonCount = 0;

  function record({
    activeVariables = [],
    ...description
  }: StepDescription<BstInsertRegion, BstInsertVariable>): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [{ label: "cmp", value: comparisonCount }],
      state: { kind: "tree", root: tree, focusedNodeId, markedNodeId: null },
    });
  }

  function insertBelow(node: TreeNode): void {
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

    if (value === node.value) {
      record({
        region: "returnNode",
        caption: rich`${code(value)} already exists`,
        historyEntry: `cmp(${value},${node.value}) → equal`,
        activeVariables: ["currentNode"],
        explanation: rich`${code(value)} is neither smaller nor larger than this node: it is already in the tree, so nothing changes.`,
      });
      return;
    }

    const side: ChildSide = value < node.value ? "left" : "right";
    const direction = directions[side];
    const comparison = `${value} ${direction.comparison} ${node.value}`;

    record({
      region: direction.compare,
      caption: rich`${code(comparison)} → ${side}`,
      historyEntry: `cmp(${value},${node.value}) → ${side}`,
      activeVariables: ["currentNode"],
      explanation: rich`Since ${code(comparison)}, the new value belongs somewhere in the ${side} subtree of ${code(node.value)}.`,
    });
    record({
      region: direction.recurse,
      caption: rich`go into the ${side} subtree`,
      historyEntry: `insert(${node.value}.${side}, ${value})`,
      activeVariables: ["currentNode"],
      explanation: rich`The function calls itself for the ${side} child (${linesOf(direction.recurse)}). Whatever that call returns becomes the ${side} child of ${code(node.value)}.`,
    });

    const child = node[side];
    if (child !== null) {
      insertBelow(child);
      return;
    }

    variables.currentNode = emptyReference;
    record({
      region: "createNode",
      caption: rich`empty spot → new node ${code(value)}`,
      historyEntry: `create(${value})`,
      activeVariables: ["currentNode"],
      explanation: rich`This subtree is empty (${linesOf("createNode")}), so a new node holding ${code(value)} is created and returned.`,
    });

    const leaf = createLeaf(value);
    tree = replaceNode(tree, node.id, withChild(node, side, leaf));
    focusedNodeId = leaf.id;
    variables.currentNode = node.value;

    record({
      region: direction.recurse,
      caption: rich`attach ${code(value)} to the ${side} of ${code(node.value)}`,
      historyEntry: `${node.value}.${side} = ${value}`,
      activeVariables: ["currentNode"],
      explanation: rich`Back in the caller, the new node becomes the ${side} child of ${code(node.value)}.`,
    });
  }

  record({
    region: "signature",
    caption: rich`insert ${code(value)}`,
    historyEntry: `insert(root, ${value})`,
    explanation: rich`To insert a value, walk down from the root as in a search. The first empty spot found along the way is where the new node belongs.`,
  });

  if (root === null) {
    const leaf = createLeaf(value);
    tree = leaf;
    focusedNodeId = leaf.id;
    variables.currentNode = emptyReference;

    record({
      region: "createNode",
      caption: rich`empty tree → ${code(value)} is the root`,
      historyEntry: `create(${value})`,
      activeVariables: ["currentNode"],
      explanation: rich`The tree is empty (${linesOf("createNode")}), so the new node holding ${code(value)} becomes the root.`,
    });
  } else {
    insertBelow(root);
  }

  record({
    region: "returnNode",
    caption: rich`done`,
    historyEntry: "return root",
    explanation: rich`Each call returns its own root on the way back up (${linesOf("returnNode")}), so the caller receives the finished tree.`,
  });

  return steps;
}
