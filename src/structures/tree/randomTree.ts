import { randomInteger, randomUniqueIntegers } from "@/lib/random";
import { buildSearchTree, type TreeNode } from "./binarySearchTree";

const smallestValue = 10;
const largestValue = 90;

export interface RandomSearchTree {
  root: TreeNode | null;
  values: number[];
}

export function createRandomSearchTree(nodeCount: number): RandomSearchTree {
  const values = randomUniqueIntegers(nodeCount, smallestValue, largestValue);

  return { root: buildSearchTree(values), values };
}

export function randomValueOutside(values: readonly number[]): number {
  const candidate = randomInteger(smallestValue, largestValue);

  return values.includes(candidate) ? randomValueOutside(values) : candidate;
}
