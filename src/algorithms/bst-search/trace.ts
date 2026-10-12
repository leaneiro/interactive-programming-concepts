import type { Step } from "@/algorithms/algorithm";
import type { TreeNode } from "@/structures/tree/binarySearchTree";
import type { TreeState } from "@/structures/tree/treeState";

export type BstSearchRegion =
  "signature" | "loop" | "found" | "goLeft" | "goRight" | "notFound";

export interface BstSearchInput {
  root: TreeNode | null;
  target: number;
}

type BstSearchStep = Step<BstSearchRegion, TreeState>;

export function traceBstSearch({
  root,
  target,
}: BstSearchInput): BstSearchStep[] {
  const steps: BstSearchStep[] = [];
  let focusedNodeId: string | null = null;

  function record(region: BstSearchRegion, note: string): void {
    steps.push({
      region,
      note,
      state: {
        kind: "tree",
        root,
        focusedNodeId,
        markedNodeId: null,
        caption: `Searching for ${target}`,
      },
    });
  }

  record("signature", `Search the tree for ${target}`);

  let node = root;
  while (node !== null) {
    focusedNodeId = node.id;
    record("loop", `Visit node ${node.value}`);

    if (target === node.value) {
      record("found", `Found ${target}`);
      return steps;
    }

    if (target < node.value) {
      record("goLeft", `${target} < ${node.value}, so go left`);
      node = node.left;
    } else {
      record("goRight", `${target} > ${node.value}, so go right`);
      node = node.right;
    }
  }

  record("notFound", `There is nowhere left to look: ${target} is not here`);

  return steps;
}
