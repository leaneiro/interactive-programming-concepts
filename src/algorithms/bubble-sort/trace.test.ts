import { describe, expect, it } from "vitest";
import { traceBubbleSort } from "./trace";

describe("traceBubbleSort", () => {
  const steps = traceBubbleSort([3, 1, 2]);

  it("logs every comparison with its outcome and every swap", () => {
    expect(steps.map((step) => step.historyEntry)).toEqual([
      "bubbleSort(a)",
      "i = 0",
      "cmp(0,1) → swap",
      "swap(0,1)",
      "cmp(1,2) → swap",
      "swap(1,2)",
      "a[2] ok",
      "i = 1",
      "cmp(0,1) → keep",
      "a[1] ok",
      "return a",
    ]);
  });

  it("points each step at the part of the code that is running", () => {
    expect(steps.map((step) => step.region)).toEqual([
      "signature",
      "outerLoop",
      "compare",
      "swap",
      "compare",
      "swap",
      "innerLoop",
      "outerLoop",
      "compare",
      "innerLoop",
      "returnResult",
    ]);
  });

  it("counts comparisons and swaps as they happen", () => {
    const countsByStep = steps.map((step) =>
      step.counters.map((counter) => `${counter.value} ${counter.label}`),
    );

    expect(countsByStep[2]).toEqual(["1 cmp", "0 swap"]);
    expect(countsByStep[3]).toEqual(["1 cmp", "1 swap"]);
    expect(countsByStep.at(-1)).toEqual(["3 cmp", "2 swap"]);
  });

  it("shows the array before a swap on the comparison and after it on the swap", () => {
    expect(steps[2].state.values).toEqual([3, 1, 2]);
    expect(steps[2].state.comparedIndices).toEqual([0, 1]);
    expect(steps[3].state.values).toEqual([1, 3, 2]);
    expect(steps[3].state.comparedIndices).toEqual([0, 1]);
  });

  it("marks the last index of a pass as sorted when the pass ends", () => {
    expect(steps[5].state.sortedIndices).toEqual([]);
    expect(steps[6].state.sortedIndices).toEqual([2]);
    expect(steps[9].state.sortedIndices).toEqual([2, 1]);
  });

  it("tracks the loop variables and the temporary value of a swap", () => {
    expect(steps[0].variables).toEqual({
      temporary: null,
      length: 3,
      outerIndex: null,
      innerIndex: null,
    });
    expect(steps[2].variables).toMatchObject({ outerIndex: 0, innerIndex: 0 });
    expect(steps[2].activeVariables).toEqual(["innerIndex"]);
    expect(steps[3].variables.temporary).toBe(3);
    expect(steps[4].variables.temporary).toBeNull();
  });

  it("writes a caption that states the comparison and its outcome", () => {
    expect(steps[2].caption).toEqual([
      "",
      { kind: "code", text: "3 > 1" },
      " → swap",
    ]);
    expect(steps[8].caption).toEqual([
      "",
      { kind: "code", text: "1 ≤ 2" },
      " → keep",
    ]);
  });
});
