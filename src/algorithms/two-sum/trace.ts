import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type {
  HashMapLookup,
  HashMapState,
} from "@/structures/hash-map/hashMapState";

export type TwoSumRegion =
  | "signature"
  | "initialize"
  | "complement"
  | "lookup"
  | "found"
  | "store"
  | "notFound";

export type TwoSumVariable = "target" | "index" | "complement";

export interface TwoSumInput {
  values: readonly number[];
  target: number;
}

type TwoSumStep = Step<TwoSumRegion, HashMapState, TwoSumVariable>;

interface TwoSumStepDescription extends StepDescription<
  TwoSumRegion,
  TwoSumVariable
> {
  lookup?: HashMapLookup | null;
  newestKey?: number | null;
}

export function traceTwoSum({ values, target }: TwoSumInput): TwoSumStep[] {
  const steps: TwoSumStep[] = [];
  const seen = new Map<number, number>();
  const variables: Record<TwoSumVariable, VariableValue> = {
    target,
    index: null,
    complement: null,
  };
  let currentIndex: number | null = null;
  let matchedIndices: number[] = [];
  let lookupCount = 0;

  function record({
    lookup = null,
    newestKey = null,
    activeVariables = [],
    ...description
  }: TwoSumStepDescription): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [
        { label: "lookups", value: lookupCount },
        { label: "seen", value: seen.size },
      ],
      state: {
        kind: "hashMap",
        arrayName: "nums",
        values,
        currentIndex,
        matchedIndices,
        mapName: "seen",
        entries: [...seen].map(([key, value]) => ({ key, value })),
        lookup,
        newestKey,
      },
    });
  }

  record({
    region: "signature",
    caption: rich`find two numbers that add up to ${code(target)}`,
    historyEntry: `target = ${target}`,
    activeVariables: ["target"],
    explanation: rich`Two Sum looks for two positions whose numbers add up to ${code(target)}. Instead of trying every pair, it walks the array once and remembers every number it passes, with its index, in a hash map.`,
  });
  record({
    region: "initialize",
    caption: rich`${code("seen")} starts empty`,
    historyEntry: "seen = {}",
    explanation: rich`${code("seen")} will map each number already visited to its index (${linesOf("initialize")}). Nothing has been visited yet, so it starts empty.`,
  });

  for (const [index, value] of values.entries()) {
    const complement = target - value;
    currentIndex = index;
    variables.index = index;
    variables.complement = complement;

    record({
      region: "complement",
      caption: rich`${code(`${target} − ${value} = ${complement}`)}`,
      historyEntry: `${target} − ${value} = ${complement}`,
      activeVariables: ["index", "complement"],
      explanation: rich`${code(`nums[${index}] = ${value}`)}. To add up to ${code(target)} it needs a partner equal to ${code(`${target} − ${value} = ${complement}`)}, its complement (${linesOf("complement")}).`,
    });

    lookupCount++;
    const partnerIndex = seen.get(complement);

    if (partnerIndex !== undefined) {
      const lookup = { key: complement, isFound: true };
      matchedIndices = [partnerIndex, index];

      record({
        region: "lookup",
        caption: rich`${code(complement)} was seen at ${code(partnerIndex)}`,
        historyEntry: `${complement} ∈ seen → ${partnerIndex}`,
        lookup,
        activeVariables: ["complement"],
        explanation: rich`${code(complement)} is in ${code("seen")} with index ${code(partnerIndex)} (${linesOf("lookup")}), and ${code(`nums[${partnerIndex}] + nums[${index}] = ${complement} + ${value} = ${target}`)}.`,
      });
      record({
        region: "found",
        caption: rich`return ${code(`[${partnerIndex}, ${index}]`)}`,
        historyEntry: `return [${partnerIndex}, ${index}]`,
        lookup,
        activeVariables: ["index"],
        explanation: rich`The function returns the two indices, ${code(`[${partnerIndex}, ${index}]`)} (${linesOf("found")}). It looked at ${code(index + 1)} of the ${code(values.length)} numbers and never compared a pair directly.`,
      });

      return steps;
    }

    record({
      region: "lookup",
      caption: rich`${code(complement)} not seen yet`,
      historyEntry: `${complement} ∉ seen`,
      lookup: { key: complement, isFound: false },
      activeVariables: ["complement"],
      explanation: rich`No number visited so far is ${code(complement)} (${linesOf("lookup")}), so ${code(value)} has no partner yet. Asking the hash map takes the same time however many numbers it holds.`,
    });

    seen.set(value, index);

    record({
      region: "store",
      caption: rich`remember ${code(value)} at ${code(index)}`,
      historyEntry: `seen[${value}] ← ${index}`,
      newestKey: value,
      activeVariables: ["index"],
      explanation: rich`${code(value)} goes into ${code("seen")} with its index ${code(index)} (${linesOf("store")}), so a later number that needs ${code(value)} will find it.`,
    });
  }

  currentIndex = null;
  variables.index = null;
  variables.complement = null;

  record({
    region: "notFound",
    caption: rich`no two numbers add up to ${code(target)}`,
    historyEntry: "return []",
    explanation: rich`The loop ended without a match: no two numbers add up to ${code(target)}, so the function returns no indices (${linesOf("notFound")}).`,
  });

  return steps;
}
