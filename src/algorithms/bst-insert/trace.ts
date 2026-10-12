import type { Step } from "@/algorithms/algorithm";
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

export interface BstInsertInput {
  root: TreeNode | null;
  value: number;
}

type BstInsertStep = Step<BstInsertRegion, TreeState>;

const directions = {
  left: { compare: "compareLeft", recurse: "recurseLeft", comparison: "<" },
  right: { compare: "compareRight", recurse: "recurseRight", comparison: ">" },
} as const;

export function traceBstInsert({
  root,
  value,
}: BstInsertInput): BstInsertStep[] {
  const steps: BstInsertStep[] = [];
  let tree = root;
  let focusedNodeId: string | null = null;

  function record(region: BstInsertRegion, note: string): void {
    steps.push({
      region,
      note,
      state: {
        kind: "tree",
        root: tree,
        focusedNodeId,
        markedNodeId: null,
        caption: `Inserting ${value}`,
      },
    });
  }

  function insertBelow(node: TreeNode): void {
    focusedNodeId = node.id;
    record("signature", `Visit node ${node.value}`);

    if (value === node.value) {
      record("returnNode", `${value} is already in the tree, nothing changes`);
      return;
    }

    const side: ChildSide = value < node.value ? "left" : "right";
    const direction = directions[side];
    record(
      direction.compare,
      `${value} ${direction.comparison} ${node.value}, so it belongs in the ${side} subtree`,
    );
    record(direction.recurse, `Recurse into the ${side} subtree`);

    const child = node[side];
    if (child !== null) {
      insertBelow(child);
      return;
    }

    record(
      "createNode",
      `The ${side} subtree is empty, create a node for ${value}`,
    );
    const leaf = createLeaf(value);
    tree = replaceNode(tree, node.id, withChild(node, side, leaf));
    focusedNodeId = leaf.id;
    record(
      direction.recurse,
      `Attach ${value} as the ${side} child of ${node.value}`,
    );
  }

  record("signature", `Insert ${value} into the tree`);

  if (root === null) {
    const leaf = createLeaf(value);
    tree = leaf;
    focusedNodeId = leaf.id;
    record("createNode", `The tree is empty, so ${value} becomes the root`);
  } else {
    insertBelow(root);
  }

  record("returnNode", "Return the root of the tree");

  return steps;
}
