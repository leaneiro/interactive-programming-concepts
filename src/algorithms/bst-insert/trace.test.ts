import { describe, expect, it } from "vitest";
import {
  buildSearchTree,
  listValuesInOrder,
} from "@/structures/tree/binarySearchTree";
import { traceBstInsert } from "./trace";

const values = [50, 30, 70, 20, 40];
const root = buildSearchTree(values);

describe("traceBstInsert", () => {
  it.each([10, 35, 45, 60, 90])("places %i in sorted position", (value) => {
    const lastStep = traceBstInsert({ root, value }).at(-1);

    expect(listValuesInOrder(lastStep?.state.root ?? null)).toEqual(
      [...values, value].toSorted((first, second) => first - second),
    );
  });

  it("only changes the tree in the step that attaches the new node", () => {
    const steps = traceBstInsert({ root, value: 60 });
    const sizes = steps.map(
      (step) => listValuesInOrder(step.state.root).length,
    );

    expect(sizes.slice(0, -2).every((size) => size === values.length)).toBe(
      true,
    );
    expect(sizes.slice(-2)).toEqual([values.length + 1, values.length + 1]);
  });

  it("leaves the tree untouched when the value already exists", () => {
    const steps = traceBstInsert({ root, value: 40 });

    expect(steps.every((step) => step.state.root === root)).toBe(true);
  });

  it("makes the value the root of an empty tree", () => {
    const lastStep = traceBstInsert({ root: null, value: 5 }).at(-1);

    expect(listValuesInOrder(lastStep?.state.root ?? null)).toEqual([5]);
  });

  it("does not mutate the input tree", () => {
    const snapshot = structuredClone(root);
    traceBstInsert({ root, value: 60 });

    expect(root).toEqual(snapshot);
  });
});
