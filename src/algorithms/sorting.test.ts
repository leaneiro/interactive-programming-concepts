import { describe, expect, it } from "vitest";
import { traceBubbleSort } from "./bubble-sort/trace";
import { traceSelectionSort } from "./selection-sort/trace";

const sortingTracers = [
  { name: "bubble sort", trace: traceBubbleSort },
  { name: "selection sort", trace: traceSelectionSort },
];

const inputs = [
  { input: [] },
  { input: [7] },
  { input: [1, 2, 3, 4] },
  { input: [4, 3, 2, 1] },
  { input: [5, 1, 5, 3, 1] },
  { input: [42, 7, 19, 3, 88, 61, 7, 15] },
];

function sortAscending(values: readonly number[]): number[] {
  return values.toSorted((first, second) => first - second);
}

function counterValues(counters: readonly { value: number }[]): number[] {
  return counters.map((counter) => counter.value);
}

describe.each(sortingTracers)("$name", ({ trace }) => {
  it.each(inputs)("sorts $input", ({ input }) => {
    const steps = trace(input);

    expect(steps.at(-1)?.state.values).toEqual(sortAscending(input));
  });

  it.each(inputs)("ends with every index of $input sorted", ({ input }) => {
    const finalState = trace(input).at(-1)?.state;

    expect(sortAscending(finalState?.sortedIndices ?? [])).toEqual([
      ...input.keys(),
    ]);
  });

  it("starts from the untouched input and never mutates it", () => {
    const input = [3, 1, 2];
    const steps = trace(input);

    expect(steps[0].state.values).toEqual([3, 1, 2]);
    expect(steps[0].state.sortedIndices).toEqual([]);
    expect(input).toEqual([3, 1, 2]);
  });

  it("keeps the same values in every step", () => {
    const input = [9, 4, 7, 1, 8];

    for (const step of trace(input)) {
      expect(sortAscending(step.state.values)).toEqual(sortAscending(input));
    }
  });

  it("only compares indices that exist", () => {
    const input = [9, 4, 7, 1, 8];

    for (const step of trace(input)) {
      for (const comparedIndex of step.state.comparedIndices) {
        expect(comparedIndex).toBeGreaterThanOrEqual(0);
        expect(comparedIndex).toBeLessThan(input.length);
      }
    }
  });

  it("never un-sorts an index or decreases a counter", () => {
    const steps = trace([9, 4, 7, 1, 8]);

    for (const [stepIndex, step] of steps.entries()) {
      if (stepIndex === 0) continue;
      const previousStep = steps[stepIndex - 1];

      expect(step.state.sortedIndices).toEqual(
        expect.arrayContaining([...previousStep.state.sortedIndices]),
      );
      for (const [counterIndex, value] of counterValues(
        step.counters,
      ).entries()) {
        expect(value).toBeGreaterThanOrEqual(
          counterValues(previousStep.counters)[counterIndex],
        );
      }
    }
  });
});
