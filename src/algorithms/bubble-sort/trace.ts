import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type { ArrayState } from "@/structures/array/arrayState";

export type BubbleSortRegion =
  "signature" | "outerLoop" | "innerLoop" | "compare" | "swap" | "returnResult";

export type BubbleSortVariable =
  "temporary" | "length" | "outerIndex" | "innerIndex";

type BubbleSortStep = Step<BubbleSortRegion, ArrayState, BubbleSortVariable>;

interface BubbleSortStepDescription extends StepDescription<
  BubbleSortRegion,
  BubbleSortVariable
> {
  comparedIndices?: readonly number[];
}

export function traceBubbleSort(input: readonly number[]): BubbleSortStep[] {
  const values = [...input];
  const steps: BubbleSortStep[] = [];
  const sortedIndices = new Set<number>();
  const variables: Record<BubbleSortVariable, VariableValue> = {
    temporary: null,
    length: values.length,
    outerIndex: null,
    innerIndex: null,
  };
  let comparisonCount = 0;
  let swapCount = 0;

  function record({
    comparedIndices = [],
    activeVariables = [],
    ...description
  }: BubbleSortStepDescription): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [
        { label: "cmp", value: comparisonCount },
        { label: "swap", value: swapCount },
      ],
      state: {
        kind: "array",
        name: "a",
        values: [...values],
        comparedIndices,
        sortedIndices: [...sortedIndices],
      },
    });
  }

  record({
    region: "signature",
    caption: rich`start`,
    historyEntry: "sort(a)",
    explanation: rich`Bubble sort walks through the array comparing neighbors and swapping the ones that are out of order. On every pass, the largest value that is not sorted yet ends up at the end.`,
  });

  for (let pass = 0; pass < values.length - 1; pass++) {
    const lastUnsortedIndex = values.length - 1 - pass;
    variables.outerIndex = pass;
    variables.innerIndex = null;

    record({
      region: "outerLoop",
      caption: rich`pass ${code(pass + 1)} of ${code(values.length - 1)}`,
      historyEntry: `i = ${pass}`,
      activeVariables: ["outerIndex"],
      explanation: rich`Pass ${code(`i = ${pass}`)} begins. The inner loop (${linesOf("innerLoop")}) will compare neighbors from ${code("a[0]")} to ${code(`a[${lastUnsortedIndex}]`)}, and the largest value in that stretch will end up at ${code(`a[${lastUnsortedIndex}]`)}.`,
    });

    for (let leftIndex = 0; leftIndex < lastUnsortedIndex; leftIndex++) {
      const rightIndex = leftIndex + 1;
      const leftValue = values[leftIndex];
      const rightValue = values[rightIndex];
      const comparedIndices = [leftIndex, rightIndex];
      const leftElement = code(`a[${leftIndex}] = ${leftValue}`);
      const rightElement = code(`a[${rightIndex}] = ${rightValue}`);
      const isOutOfOrder = leftValue > rightValue;

      variables.innerIndex = leftIndex;
      comparisonCount++;

      if (!isOutOfOrder) {
        record({
          region: "compare",
          caption: rich`${code(`${leftValue} ≤ ${rightValue}`)} → keep`,
          historyEntry: `cmp(${leftIndex},${rightIndex}) → keep`,
          comparedIndices,
          activeVariables: ["innerIndex"],
          explanation: rich`Compares two neighbors (${linesOf("compare")}). Since ${leftElement} is not greater than ${rightElement}, the condition is false and both stay where they are.`,
        });
        continue;
      }

      record({
        region: "compare",
        caption: rich`${code(`${leftValue} > ${rightValue}`)} → swap`,
        historyEntry: `cmp(${leftIndex},${rightIndex}) → swap`,
        comparedIndices,
        activeVariables: ["innerIndex"],
        explanation: rich`Compares two neighbors (${linesOf("compare")}). Since ${leftElement} is greater than ${rightElement}, the condition is true and the two will trade places (${linesOf("swap")}).`,
      });

      values[leftIndex] = rightValue;
      values[rightIndex] = leftValue;
      variables.temporary = leftValue;
      swapCount++;

      record({
        region: "swap",
        caption: rich`swap ${code(leftValue)} ↔ ${code(rightValue)}`,
        historyEntry: `swap(${leftIndex},${rightIndex})`,
        comparedIndices,
        activeVariables: ["innerIndex", "temporary"],
        explanation: rich`Swap done: ${code(`a[${leftIndex}]`)} is now ${code(rightValue)} and ${code(`a[${rightIndex}]`)} is ${code(leftValue)}. The larger value moved one position closer to the end of the array.`,
      });

      variables.temporary = null;
    }

    sortedIndices.add(lastUnsortedIndex);
    variables.innerIndex = lastUnsortedIndex;

    record({
      region: "innerLoop",
      caption: rich`${code(values[lastUnsortedIndex])} is in place`,
      historyEntry: `a[${lastUnsortedIndex}] ok`,
      activeVariables: ["innerIndex"],
      explanation: rich`The inner loop reached the end of the unsorted stretch (${linesOf("innerLoop")}). ${code(`a[${lastUnsortedIndex}] = ${values[lastUnsortedIndex]}`)} is the largest value in that stretch and is now in its final position.`,
    });
  }

  for (const valueIndex of values.keys()) sortedIndices.add(valueIndex);
  variables.outerIndex = null;
  variables.innerIndex = null;

  record({
    region: "returnResult",
    caption: rich`array sorted`,
    historyEntry: "return a",
    explanation: rich`Every pass is done and the array is sorted. It took ${code(comparisonCount)} comparisons and ${code(swapCount)} swaps.`,
  });

  return steps;
}
