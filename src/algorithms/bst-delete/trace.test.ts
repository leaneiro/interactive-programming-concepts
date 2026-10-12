import { describe, expect, it } from "vitest";
import {
  buildSearchTree,
  listValuesInOrder,
} from "@/structures/tree/binarySearchTree";
import { traceBstDelete } from "./trace";

const values = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65, 10];
const root = buildSearchTree(values);

function deleteAndListValues(
  tree: ReturnType<typeof buildSearchTree>,
  value: number,
): number[] {
  const lastStep = traceBstDelete({ root: tree, value }).at(-1);

  return listValuesInOrder(lastStep?.state.root ?? null);
}

describe("traceBstDelete", () => {
  it.each(values)("removes %i and keeps the rest in order", (value) => {
    const expectedValues = values
      .filter((candidate) => candidate !== value)
      .toSorted((first, second) => first - second);

    expect(deleteAndListValues(root, value)).toEqual(expectedValues);
  });

  it("removes a node whose only child is on the left", () => {
    const leftLeaningTree = buildSearchTree([50, 30, 20, 10]);

    expect(deleteAndListValues(leftLeaningTree, 30)).toEqual([10, 20, 50]);
  });

  it("removes a node whose only child is on the right", () => {
    const rightLeaningTree = buildSearchTree([10, 20, 30, 25, 40]);

    expect(deleteAndListValues(rightLeaningTree, 20)).toEqual([10, 25, 30, 40]);
  });

  it("empties a tree that only has the root", () => {
    expect(deleteAndListValues(buildSearchTree([7]), 7)).toEqual([]);
  });

  it.each([
    { value: 30, successorRemoval: "removeLeaf" },
    { value: 50, successorRemoval: "replaceWithRightChild" },
  ])(
    "copies the successor of $value and then removes its original node",
    ({ value, successorRemoval }) => {
      const regions = traceBstDelete({ root, value }).map(
        (step) => step.region,
      );
      const regionsAfterSearch = regions.slice(
        regions.lastIndexOf("findSuccessor") + 1,
      );

      expect(regionsAfterSearch.slice(0, 2)).toEqual([
        "copySuccessor",
        "removeSuccessor",
      ]);
      expect(regionsAfterSearch.at(-2)).toBe(successorRemoval);
    },
  );

  it("marks the node that is about to disappear", () => {
    const markedNodeIds = traceBstDelete({ root, value: 10 }).map(
      (step) => step.state.markedNodeId,
    );

    expect(markedNodeIds).toContain("node-10");
    expect(markedNodeIds.at(-1)).toBeNull();
  });

  it("leaves the tree untouched when the value is missing", () => {
    const steps = traceBstDelete({ root, value: 99 });

    expect(steps.some((step) => step.region === "notFound")).toBe(true);
    expect(steps.every((step) => step.state.root === root)).toBe(true);
  });

  it("does not mutate the input tree", () => {
    const snapshot = structuredClone(root);
    traceBstDelete({ root, value: 50 });

    expect(root).toEqual(snapshot);
  });
});
