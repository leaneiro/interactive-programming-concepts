import { describe, expect, it } from "vitest";
import { buildSearchTree } from "./binarySearchTree";
import { layoutTree } from "./treeLayout";

describe("layoutTree", () => {
  const { nodes, edges } = layoutTree(
    buildSearchTree([50, 30, 70, 20, 40, 60, 80]),
  );

  it("returns nothing for an empty tree", () => {
    expect(layoutTree(null)).toEqual({ nodes: [], edges: [] });
  });

  it("gives every node its own column, ordered by value", () => {
    const valuesFromLeftToRight = nodes
      .toSorted((first, second) => first.x - second.x)
      .map((node) => node.value);

    expect(valuesFromLeftToRight).toEqual([20, 30, 40, 50, 60, 70, 80]);
    expect(new Set(nodes.map((node) => node.x)).size).toBe(nodes.length);
  });

  it("places each level on its own row", () => {
    const rowOf = (value: number) =>
      nodes.find((node) => node.value === value)?.y;

    expect(rowOf(50)).toBe(0);
    expect(rowOf(30)).toBe(rowOf(70));
    expect(rowOf(20)).toBe(rowOf(80));
    expect(rowOf(20)).toBeGreaterThan(rowOf(30) ?? 0);
  });

  it("connects every node except the root to its parent", () => {
    const connections = edges.map(
      ({ parent, child }) => `${parent.value}-${child.value}`,
    );

    expect(connections.toSorted()).toEqual([
      "30-20",
      "30-40",
      "50-30",
      "50-70",
      "70-60",
      "70-80",
    ]);
  });
});
