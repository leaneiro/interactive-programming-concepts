import type { TreeNode } from "./binarySearchTree";

export interface TreeState {
  kind: "tree";
  root: TreeNode | null;
  focusedNodeId: string | null;
  markedNodeId: string | null;
}
