import { describe, expect, it } from "vitest";
import { buildSearchTree } from "@/structures/tree/binarySearchTree";
import { traceBstSearch } from "./trace";

const root = buildSearchTree([50, 30, 70, 20, 40, 60, 80]);

describe("traceBstSearch", () => {
  it("ends on the node that holds the target", () => {
    const lastStep = traceBstSearch({ root, target: 60 }).at(-1);

    expect(lastStep?.region).toBe("found");
    expect(lastStep?.state.focusedNodeId).toBe("node-60");
  });

  it("walks down one branch, comparing at every node", () => {
    const visitedNotes = traceBstSearch({ root, target: 40 })
      .filter((step) => step.region === "loop")
      .map((step) => step.note);

    expect(visitedNotes).toEqual([
      "Visit node 50",
      "Visit node 30",
      "Visit node 40",
    ]);
  });

  it("reports a missing target after reaching a dead end", () => {
    const steps = traceBstSearch({ root, target: 65 });

    expect(steps.at(-1)?.region).toBe("notFound");
    expect(steps.some((step) => step.region === "found")).toBe(false);
  });

  it("handles an empty tree", () => {
    const regions = traceBstSearch({ root: null, target: 1 }).map(
      (step) => step.region,
    );

    expect(regions).toEqual(["signature", "notFound"]);
  });
});
