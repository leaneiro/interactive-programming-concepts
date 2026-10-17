import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type {
  SearchOutcome,
  SearchRangeState,
} from "@/structures/search-range/searchRangeState";

export type BinarySearchRegion =
  | "signature"
  | "initialize"
  | "middle"
  | "found"
  | "goRight"
  | "goLeft"
  | "notFound";

export type BinarySearchVariable = "target" | "low" | "high" | "middle";

export interface BinarySearchInput {
  values: readonly number[];
  target: number;
}

type BinarySearchStep = Step<
  BinarySearchRegion,
  SearchRangeState,
  BinarySearchVariable
>;

function describePositions(first: number, last: number): string {
  return first === last ? `position ${first}` : `positions ${first}–${last}`;
}

function mostChecksFor(valueCount: number): number {
  return Math.ceil(Math.log2(valueCount + 1));
}

export function traceBinarySearch({
  values,
  target,
}: BinarySearchInput): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
  const variables: Record<BinarySearchVariable, VariableValue> = {
    target,
    low: null,
    high: null,
    middle: null,
  };
  let low: number | null = null;
  let high: number | null = null;
  let middle: number | null = null;
  let outcome: SearchOutcome = "searching";
  let comparisonCount = 0;

  function rangeSize(): number {
    return low === null || high === null ? values.length : high - low + 1;
  }

  function record({
    activeVariables = [],
    ...description
  }: StepDescription<BinarySearchRegion, BinarySearchVariable>): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [
        { label: "cmp", value: comparisonCount },
        { label: "range", value: rangeSize() },
      ],
      state: {
        kind: "searchRange",
        name: "nums",
        values,
        target,
        low,
        high,
        middle,
        outcome,
      },
    });
  }

  record({
    region: "signature",
    caption: rich`look for ${code(target)} in a sorted array`,
    historyEntry: `target = ${target}`,
    activeVariables: ["target"],
    explanation: rich`Binary search finds a value in a sorted array by checking the middle of the range that can still hold it. Each check throws away half of that range, so ${code(values.length)} numbers need at most ${code(mostChecksFor(values.length))} checks.`,
  });

  low = 0;
  high = values.length - 1;
  variables.low = low;
  variables.high = high;

  record({
    region: "initialize",
    caption: rich`the range starts as the whole array`,
    historyEntry: `low = ${low}, high = ${high}`,
    activeVariables: ["low", "high"],
    explanation: rich`${code("low")} and ${code("high")} mark the first and last positions where ${code(target)} could be (${linesOf("initialize")}). At the start that is every position, from ${code(low)} to ${code(high)}.`,
  });

  while (low <= high) {
    middle = low + Math.floor((high - low) / 2);
    const value = values[middle];
    variables.middle = middle;
    comparisonCount++;

    record({
      region: "middle",
      caption: rich`check the middle, ${code(`nums[${middle}] = ${value}`)}`,
      historyEntry: `mid = ${middle}`,
      activeVariables: ["middle"],
      explanation: rich`${code(`${low} ≤ ${high}`)}, so ${code(rangeSize())} positions are still in range (${linesOf("middle")}). ${code("mid")} lands halfway between ${code("low")} and ${code("high")}, at position ${code(middle)}.`,
    });

    if (value === target) {
      outcome = "found";

      record({
        region: "found",
        caption: rich`${code(`${value} = ${target}`)} → found at ${code(middle)}`,
        historyEntry: `${value} = ${target} → found`,
        activeVariables: ["middle"],
        explanation: rich`${code(`nums[${middle}]`)} is exactly ${code(target)} (${linesOf("found")}), so the function returns its position, ${code(middle)}. It took ${code(comparisonCount)} of at most ${code(mostChecksFor(values.length))} checks.`,
      });

      return steps;
    }

    if (value < target) {
      const discarded = describePositions(low, middle);
      low = middle + 1;
      variables.low = low;

      record({
        region: "goRight",
        caption: rich`${code(`${value} < ${target}`)} → right`,
        historyEntry: `${value} < ${target} → right`,
        activeVariables: ["low"],
        explanation: rich`${code(value)} is smaller than ${code(target)}, and the array is sorted, so ${code(target)} can only be to the right of position ${code(middle)}. ${code("low")} moves to ${code(low)} (${linesOf("goRight")}), discarding ${discarded}.`,
      });
    } else {
      const discarded = describePositions(middle, high);
      high = middle - 1;
      variables.high = high;

      record({
        region: "goLeft",
        caption: rich`${code(`${value} > ${target}`)} → left`,
        historyEntry: `${value} > ${target} → left`,
        activeVariables: ["high"],
        explanation: rich`${code(value)} is larger than ${code(target)}, and the array is sorted, so ${code(target)} can only be to the left of position ${code(middle)}. ${code("high")} moves to ${code(high)} (${linesOf("goLeft")}), discarding ${discarded}.`,
      });
    }
  }

  middle = null;
  outcome = "missing";

  record({
    region: "notFound",
    caption: rich`${code(target)} is not in the array`,
    historyEntry: "not found",
    activeVariables: ["low", "high"],
    explanation: rich`${code("low")} passed ${code("high")}, so no position is left in range and the loop stops. ${code(target)} is not in the array, and the function reports it as missing (${linesOf("notFound")}).`,
  });

  return steps;
}
