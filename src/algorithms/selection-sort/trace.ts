import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type { ArrayState } from "@/structures/array/arrayState";

export type SelectionSortRegion =
  | "signature"
  | "outerLoop"
  | "compare"
  | "updateMinimum"
  | "alreadyInPlace"
  | "swap"
  | "returnResult";

export type SelectionSortVariable =
  "temporary" | "length" | "targetIndex" | "candidateIndex" | "minimumIndex";

type SelectionSortStep = Step<
  SelectionSortRegion,
  ArrayState,
  SelectionSortVariable
>;

interface SelectionSortStepDescription extends StepDescription<
  SelectionSortRegion,
  SelectionSortVariable
> {
  comparedIndices?: readonly number[];
}

export function traceSelectionSort(
  input: readonly number[],
): SelectionSortStep[] {
  const values = [...input];
  const steps: SelectionSortStep[] = [];
  const sortedIndices = new Set<number>();
  const variables: Record<SelectionSortVariable, VariableValue> = {
    temporary: null,
    length: values.length,
    targetIndex: null,
    candidateIndex: null,
    minimumIndex: null,
  };
  let comparisonCount = 0;
  let swapCount = 0;

  function record({
    comparedIndices = [],
    activeVariables = [],
    ...description
  }: SelectionSortStepDescription): void {
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
    historyEntry: "selectionSort(arr)",
    explanation: rich`Selection sort looks for the smallest value in the stretch that is not sorted yet and puts it at the start of that stretch. On every pass, the sorted stretch at the beginning grows by one position.`,
  });

  for (let targetIndex = 0; targetIndex < values.length - 1; targetIndex++) {
    let minimumIndex = targetIndex;
    variables.targetIndex = targetIndex;
    variables.minimumIndex = minimumIndex;
    variables.candidateIndex = null;

    record({
      region: "outerLoop",
      caption: rich`find the value for ${code(`a[${targetIndex}]`)}`,
      historyEntry: `i = ${targetIndex}, smallest = ${minimumIndex}`,
      comparedIndices: [targetIndex],
      activeVariables: ["targetIndex", "minimumIndex"],
      explanation: rich`Pass ${code(`i = ${targetIndex}`)} begins. For now the smallest known value is ${code(`a[${targetIndex}] = ${values[targetIndex]}`)} itself, so ${code(`smallest = ${targetIndex}`)}.`,
    });

    for (
      let candidateIndex = targetIndex + 1;
      candidateIndex < values.length;
      candidateIndex++
    ) {
      const candidateValue = values[candidateIndex];
      const minimumValue = values[minimumIndex];
      const comparedIndices = [candidateIndex, minimumIndex];
      const candidateElement = code(`a[${candidateIndex}] = ${candidateValue}`);
      const minimumElement = code(`a[${minimumIndex}] = ${minimumValue}`);

      variables.candidateIndex = candidateIndex;
      comparisonCount++;

      if (candidateValue >= minimumValue) {
        record({
          region: "compare",
          caption: rich`${code(`${candidateValue} ≥ ${minimumValue}`)} → keep`,
          historyEntry: `cmp(${candidateIndex},${minimumIndex}) → keep`,
          comparedIndices,
          activeVariables: ["candidateIndex"],
          explanation: rich`Compares the candidate with the current minimum (${linesOf("compare")}). Since ${candidateElement} is not smaller than ${minimumElement}, the minimum stays the same.`,
        });
        continue;
      }

      record({
        region: "compare",
        caption: rich`${code(`${candidateValue} < ${minimumValue}`)} → new minimum`,
        historyEntry: `cmp(${candidateIndex},${minimumIndex}) → smallest`,
        comparedIndices,
        activeVariables: ["candidateIndex"],
        explanation: rich`Compares the candidate with the current minimum (${linesOf("compare")}). Since ${candidateElement} is smaller than ${minimumElement}, it becomes the new minimum (${linesOf("updateMinimum")}).`,
      });

      minimumIndex = candidateIndex;
      variables.minimumIndex = minimumIndex;

      record({
        region: "updateMinimum",
        caption: rich`minimum is now ${code(candidateValue)}`,
        historyEntry: `smallest = ${minimumIndex}`,
        comparedIndices: [minimumIndex],
        activeVariables: ["minimumIndex"],
        explanation: rich`${code(`smallest = ${minimumIndex}`)}: the smallest value found in this pass so far is ${candidateElement}.`,
      });
    }

    variables.candidateIndex = null;
    sortedIndices.add(targetIndex);

    if (minimumIndex === targetIndex) {
      record({
        region: "alreadyInPlace",
        caption: rich`${code(values[targetIndex])} is already in place`,
        historyEntry: `a[${targetIndex}] ok`,
        activeVariables: ["minimumIndex"],
        explanation: rich`No smaller value showed up: ${code("smallest")} is still equal to ${code("i")} (${linesOf("alreadyInPlace")}), so ${code(`a[${targetIndex}] = ${values[targetIndex]}`)} is already in its final position and nothing is swapped.`,
      });
      continue;
    }

    const targetValue = values[targetIndex];
    const minimumValue = values[minimumIndex];
    values[targetIndex] = minimumValue;
    values[minimumIndex] = targetValue;
    variables.temporary = targetValue;
    swapCount++;

    record({
      region: "swap",
      caption: rich`swap ${code(targetValue)} ↔ ${code(minimumValue)}`,
      historyEntry: `swap(${targetIndex},${minimumIndex})`,
      comparedIndices: [targetIndex, minimumIndex],
      activeVariables: ["temporary"],
      explanation: rich`The smallest value of the pass, ${code(minimumValue)}, trades places with ${code(targetValue)}. Now ${code(`a[${targetIndex}] = ${minimumValue}`)} is in its final position.`,
    });

    variables.temporary = null;
  }

  for (const valueIndex of values.keys()) sortedIndices.add(valueIndex);
  variables.targetIndex = null;
  variables.minimumIndex = null;

  record({
    region: "returnResult",
    caption: rich`array sorted`,
    historyEntry: "return a",
    explanation: rich`Every position got its value and the array is sorted. It took ${code(comparisonCount)} comparisons and ${code(swapCount)} swaps.`,
  });

  return steps;
}
