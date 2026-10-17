import { describe, expect, it } from "vitest";
import { traceTwoSum } from "./trace";

describe("traceTwoSum", () => {
  const steps = traceTwoSum({ values: [5, 1, 8, 3, 9, 4], target: 13 });
  const lastStep = steps[steps.length - 1];

  it("returns the indices of the first pair that adds up to the target", () => {
    expect(lastStep.region).toBe("found");
    expect(lastStep.state.matchedIndices).toEqual([0, 2]);
    expect(lastStep.historyEntry).toBe("return [0, 2]");
  });

  it("stores every number it passes, with its index, until the match", () => {
    const storedKeys = steps
      .filter((step) => step.region === "store")
      .map((step) => step.state.newestKey);

    expect(storedKeys).toEqual([5, 1]);
    expect(lastStep.state.entries).toEqual([
      { key: 5, value: 0 },
      { key: 1, value: 1 },
    ]);
  });

  it("looks up the complement of each number once", () => {
    const lookups = steps
      .filter((step) => step.region === "lookup")
      .map((step) => step.state.lookup);

    expect(lookups).toEqual([
      { key: 8, isFound: false },
      { key: 12, isFound: false },
      { key: 5, isFound: true },
    ]);
    expect(lastStep.counters).toContainEqual({ label: "lookups", value: 3 });
  });

  it("pairs a number with an equal one seen before it", () => {
    const repeated = traceTwoSum({ values: [3, 3], target: 6 });

    expect(repeated[repeated.length - 1].state.matchedIndices).toEqual([0, 1]);
  });

  it("ends with no indices when no pair adds up to the target", () => {
    const missing = traceTwoSum({ values: [1, 2, 3], target: 7 });
    const finalStep = missing[missing.length - 1];

    expect(finalStep.region).toBe("notFound");
    expect(finalStep.state.matchedIndices).toEqual([]);
    expect(finalStep.state.entries).toHaveLength(3);
  });
});
