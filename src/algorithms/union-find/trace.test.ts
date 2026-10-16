import { describe, expect, it } from "vitest";
import { traceUnionFind, type ElementPair } from "./trace";

const pairs: readonly ElementPair[] = [
  [0, 1],
  [2, 1],
  [3, 4],
  [1, 4],
  [4, 0],
];

describe("traceUnionFind", () => {
  const steps = traceUnionFind({ elementCount: 5, pairs });

  it("starts with every element as its own root", () => {
    expect(steps[0].state.parent).toEqual([0, 1, 2, 3, 4]);
  });

  it("links the root of the second element under the root of the first", () => {
    const firstLink = steps.find((step) => step.region === "link");

    expect(firstLink?.state.parent).toEqual([0, 0, 2, 3, 4]);
  });

  it("points every element it climbs through straight at the root", () => {
    const compressions = steps
      .filter((step) => step.historyEntry.includes("←"))
      .filter((step) => step.region === "compress")
      .map((step) => step.historyEntry);

    expect(compressions).toEqual(["parent[1] ← 2", "parent[4] ← 2"]);
  });

  it("leaves the array alone when both elements already share a root", () => {
    const lastUnion = steps.findLastIndex((step) => step.region === "nextPair");
    const stepsOfLastUnion = steps.slice(lastUnion);

    expect(stepsOfLastUnion.map((step) => step.region)).not.toContain("link");
    expect(steps.at(-2)?.historyEntry).toBe("2 = 2 → skip");
  });

  it("ends with one set whose root is 2", () => {
    const lastStep = steps.at(-1);

    expect(lastStep?.state.parent).toEqual([2, 2, 2, 2, 2]);
    expect(lastStep?.counters).toContainEqual({ label: "sets", value: 1 });
  });

  it("keeps unrelated pairs in separate sets", () => {
    const lastStep = traceUnionFind({
      elementCount: 4,
      pairs: [
        [0, 1],
        [2, 3],
      ],
    }).at(-1);

    expect(lastStep?.state.parent).toEqual([0, 0, 2, 2]);
    expect(lastStep?.counters).toContainEqual({ label: "sets", value: 2 });
  });

  it("shows every union up front and marks each one as it is done", () => {
    const statusesOf = (step: (typeof steps)[number]) =>
      step.state.unions.map((union) => union.status);
    const thirdUnion = steps.filter((step) => step.region === "nextPair")[2];
    const [lastComparison, lastStep] = steps.slice(-2);

    expect(
      steps[0].state.unions.map(({ first, second }) => [first, second]),
    ).toEqual(pairs);
    expect(statusesOf(steps[0])).toEqual(Array(5).fill("pending"));
    expect(statusesOf(thirdUnion)).toEqual([
      "linked",
      "linked",
      "current",
      "pending",
      "pending",
    ]);
    expect(statusesOf(lastComparison).at(-1)).toBe("current");
    expect(statusesOf(lastStep)).toEqual([
      "linked",
      "linked",
      "linked",
      "linked",
      "skipped",
    ]);
  });

  it("leaves the stack of open find calls empty between unions", () => {
    const unionSteps = steps.filter((step) =>
      ["nextPair", "compareRoots", "link"].includes(step.region),
    );

    for (const step of unionSteps) {
      expect(step.state.pathElements).toEqual([]);
    }
  });
});
