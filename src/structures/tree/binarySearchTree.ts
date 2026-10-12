export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export type ChildSide = "left" | "right";

export function createLeaf(value: number): TreeNode {
  return { id: `node-${value}`, value, left: null, right: null };
}

export function withChild(
  node: TreeNode,
  side: ChildSide,
  child: TreeNode | null,
): TreeNode {
  return side === "left" ? { ...node, left: child } : { ...node, right: child };
}

export function insertValue(root: TreeNode | null, value: number): TreeNode {
  if (root === null) return createLeaf(value);
  if (value < root.value) {
    return { ...root, left: insertValue(root.left, value) };
  }
  if (value > root.value) {
    return { ...root, right: insertValue(root.right, value) };
  }
  return root;
}

export function buildSearchTree(values: readonly number[]): TreeNode | null {
  return values.reduce<TreeNode | null>(
    (root, value) => insertValue(root, value),
    null,
  );
}

export function replaceNode(
  root: TreeNode | null,
  nodeId: string,
  replacement: TreeNode | null,
): TreeNode | null {
  if (root === null) return null;
  if (root.id === nodeId) return replacement;

  return {
    ...root,
    left: replaceNode(root.left, nodeId, replacement),
    right: replaceNode(root.right, nodeId, replacement),
  };
}

export function findPathTo(root: TreeNode | null, nodeId: string): string[] {
  if (root === null) return [];
  if (root.id === nodeId) return [root.id];

  const pathBelow = [
    ...findPathTo(root.left, nodeId),
    ...findPathTo(root.right, nodeId),
  ];

  return pathBelow.length > 0 ? [root.id, ...pathBelow] : [];
}

export function listValuesInOrder(root: TreeNode | null): number[] {
  if (root === null) return [];

  return [
    ...listValuesInOrder(root.left),
    root.value,
    ...listValuesInOrder(root.right),
  ];
}
