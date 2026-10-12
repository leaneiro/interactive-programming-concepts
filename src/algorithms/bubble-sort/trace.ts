import type { Step } from "@/algorithms/algorithm";
import type { ArrayState } from "@/structures/array/arrayState";

export type BubbleSortRegion =
  "signature" | "outerLoop" | "innerLoop" | "compare" | "swap" | "returnResult";

type BubbleSortStep = Step<BubbleSortRegion, ArrayState>;

export function traceBubbleSort(input: readonly number[]): BubbleSortStep[] {
  const values = [...input];
  const steps: BubbleSortStep[] = [];

  function record(
    region: BubbleSortRegion,
    note: string,
    highlightedIndices: readonly number[] = [],
  ): void {
    steps.push({
      region,
      note,
      state: { kind: "array", values: [...values], highlightedIndices },
    });
  }

  record("signature", "Start bubble sort");

  for (let pass = 0; pass < values.length - 1; pass++) {
    const lastUnsortedIndex = values.length - 1 - pass;
    record(
      "outerLoop",
      `Pass ${pass + 1}: the largest remaining value will move to index ${lastUnsortedIndex}`,
    );

    for (let leftIndex = 0; leftIndex < lastUnsortedIndex; leftIndex++) {
      const rightIndex = leftIndex + 1;
      const leftValue = values[leftIndex];
      const rightValue = values[rightIndex];
      const comparedIndices = [leftIndex, rightIndex];

      record(
        "compare",
        `Compare ${leftValue} (index ${leftIndex}) with ${rightValue} (index ${rightIndex})`,
        comparedIndices,
      );

      if (leftValue > rightValue) {
        values[leftIndex] = rightValue;
        values[rightIndex] = leftValue;
        record(
          "swap",
          `${leftValue} is greater than ${rightValue}, so swap them`,
          comparedIndices,
        );
      } else {
        record(
          "innerLoop",
          `${leftValue} is not greater than ${rightValue}, so leave them in place`,
          comparedIndices,
        );
      }
    }
  }

  record("returnResult", "Every value is in place, return the sorted array");

  return steps;
}
