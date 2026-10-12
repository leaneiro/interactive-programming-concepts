import type { Step } from "@/algorithms/algorithm";
import type { ArrayState } from "@/structures/array/arrayState";

export type SelectionSortRegion =
  | "signature"
  | "outerLoop"
  | "compare"
  | "updateMinimum"
  | "alreadyInPlace"
  | "swap"
  | "returnResult";

type SelectionSortStep = Step<SelectionSortRegion, ArrayState>;

export function traceSelectionSort(
  input: readonly number[],
): SelectionSortStep[] {
  const values = [...input];
  const steps: SelectionSortStep[] = [];

  function record(
    region: SelectionSortRegion,
    note: string,
    highlightedIndices: readonly number[] = [],
  ): void {
    steps.push({
      region,
      note,
      state: { kind: "array", values: [...values], highlightedIndices },
    });
  }

  record("signature", "Start selection sort");

  for (let targetIndex = 0; targetIndex < values.length - 1; targetIndex++) {
    let minimumIndex = targetIndex;
    record(
      "outerLoop",
      `Look for the value that belongs at index ${targetIndex}, assuming ${values[targetIndex]} is the minimum`,
      [targetIndex],
    );

    for (
      let candidateIndex = targetIndex + 1;
      candidateIndex < values.length;
      candidateIndex++
    ) {
      record(
        "compare",
        `Compare ${values[candidateIndex]} with the current minimum ${values[minimumIndex]}`,
        [candidateIndex, minimumIndex],
      );

      if (values[candidateIndex] < values[minimumIndex]) {
        minimumIndex = candidateIndex;
        record("updateMinimum", `${values[minimumIndex]} is the new minimum`, [
          minimumIndex,
        ]);
      }
    }

    if (minimumIndex === targetIndex) {
      record(
        "alreadyInPlace",
        `${values[targetIndex]} is already at index ${targetIndex}`,
        [targetIndex],
      );
      continue;
    }

    const targetValue = values[targetIndex];
    const minimumValue = values[minimumIndex];
    values[targetIndex] = minimumValue;
    values[minimumIndex] = targetValue;
    record(
      "swap",
      `Swap the minimum ${minimumValue} with ${targetValue} at index ${targetIndex}`,
      [targetIndex, minimumIndex],
    );
  }

  record("returnResult", "Every value is in place, return the sorted array");

  return steps;
}
