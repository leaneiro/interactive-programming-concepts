import type { Step } from "@/algorithms/algorithm";
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

export interface BstDeleteInput {
  root: TreeNode | null;
  value: number;
}

type BstDeleteStep = Step<BstDeleteRegion, TreeState>;

const directions = {
  left: { compare: "compareLeft", recurse: "recurseLeft", comparison: "<" },
  right: { compare: "compareRight", recurse: "recurseRight", comparison: ">" },
} as const;

export function traceBstDelete({
  root,
  value,
}: BstDeleteInput): BstDeleteStep[] {
  const steps: BstDeleteStep[] = [];
  let tree = root;
  let focusedNodeId: string | null = null;
  let markedNodeId: string | null = null;

  function record(region: BstDeleteRegion, note: string): void {
    steps.push({
      region,
      note,
      state: {
        kind: "tree",
        root: tree,
        focusedNodeId,
        markedNodeId,
        caption: `Deleting ${value}`,
      },
    });
  }

  function removeFrom(node: TreeNode | null, target: number): void {
    if (node === null) {
      record("notFound", `${target} is not in the tree, nothing changes`);
      return;
    }

    focusedNodeId = node.id;
    record("signature", `Visit node ${node.value}`);

    if (target !== node.value) {
      const side: ChildSide = target < node.value ? "left" : "right";
      const direction = directions[side];
      record(
        direction.compare,
        `${target} ${direction.comparison} ${node.value}, so look in the ${side} subtree`,
      );
      record(direction.recurse, `Recurse into the ${side} subtree`);
      removeFrom(node[side], target);
      return;
    }

    markedNodeId = node.id;
    record("found", `Found ${target}, this is the node to remove`);

    if (node.left === null || node.right === null) {
      replaceWithOnlyChild(node, node.left ?? node.right);
      return;
    }

    let successor = node.right;
    focusedNodeId = successor.id;
    record(
      "findSuccessor",
      `${target} has two children, so find its successor: the smallest value in the right subtree, starting at ${successor.value}`,
    );

    while (successor.left !== null) {
      successor = successor.left;
      focusedNodeId = successor.id;
      record("findSuccessor", `Keep going left to ${successor.value}`);
    }

    tree = replaceNode(tree, node.id, { ...node, value: successor.value });
    focusedNodeId = node.id;
    markedNodeId = successor.id;
    record(
      "copySuccessor",
      `Copy the successor ${successor.value} over ${target}`,
    );
    record(
      "removeSuccessor",
      `Remove the original ${successor.value} from the right subtree`,
    );
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
      record("removeLeaf", `${node.value} has no children, so just remove it`);
    } else if (node.left === null) {
      record(
        "replaceWithRightChild",
        `${node.value} only has a right child, so ${onlyChild.value} takes its place`,
      );
    } else {
      record(
        "replaceWithLeftChild",
        `${node.value} only has a left child, so ${onlyChild.value} takes its place`,
      );
    }
  }

  record("signature", `Delete ${value} from the tree`);
  removeFrom(root, value);
  record("returnNode", "Return the root of the tree");

  return steps;
}
