import type {
  Step,
  StepDescription,
  VariableValue,
} from "@/algorithms/algorithm";
import { code, linesOf, rich } from "@/algorithms/richText";
import type { ForestState, UnionStatus } from "@/structures/forest/forestState";

export type UnionFindRegion =
  | "signature"
  | "initialize"
  | "nextPair"
  | "checkRoot"
  | "compress"
  | "returnRoot"
  | "findFirstRoot"
  | "findSecondRoot"
  | "compareRoots"
  | "link"
  | "returnResult";

export type UnionFindVariable =
  "first" | "second" | "element" | "firstRoot" | "secondRoot";

export type ElementPair = readonly [number, number];

export interface UnionFindInput {
  elementCount: number;
  pairs: readonly ElementPair[];
}

type UnionFindStep = Step<UnionFindRegion, ForestState, UnionFindVariable>;

interface UnionFindStepDescription extends StepDescription<
  UnionFindRegion,
  UnionFindVariable
> {
  focusedElements?: readonly number[];
}

export function traceUnionFind({
  elementCount,
  pairs,
}: UnionFindInput): UnionFindStep[] {
  const steps: UnionFindStep[] = [];
  const parent = Array.from(
    { length: elementCount },
    (_unused, element) => element,
  );
  const openFindCalls: number[] = [];
  const unionStatuses = pairs.map((): UnionStatus => "pending");
  const variables: Record<UnionFindVariable, VariableValue> = {
    first: null,
    second: null,
    element: null,
    firstRoot: null,
    secondRoot: null,
  };
  let findCallCount = 0;

  function record({
    focusedElements = [],
    activeVariables = [],
    ...description
  }: UnionFindStepDescription): void {
    steps.push({
      ...description,
      activeVariables,
      variables: { ...variables },
      counters: [
        { label: "sets", value: listSets(parent).length },
        { label: "find", value: findCallCount },
      ],
      state: {
        kind: "forest",
        name: "parent",
        parent: [...parent],
        focusedElements,
        pathElements: [...openFindCalls],
        unions: pairs.map(([first, second], pairIndex) => ({
          first,
          second,
          status: unionStatuses[pairIndex],
        })),
      },
    });
  }

  function find(element: number): number {
    const parentElement = parent[element];
    findCallCount++;
    openFindCalls.push(element);
    variables.element = element;

    if (parentElement === element) {
      record({
        region: "checkRoot",
        caption: rich`${code(element)} is a root`,
        historyEntry: `parent[${element}] = ${element} → root`,
        focusedElements: [element],
        activeVariables: ["element"],
        explanation: rich`${code(`parent[${element}] = ${element}`)}: the element points to itself, so the condition on ${linesOf("checkRoot")} is false. ${code(element)} is the root of its set, and this call returns it (${linesOf("returnRoot")}).`,
      });
      openFindCalls.pop();

      return element;
    }

    record({
      region: "checkRoot",
      caption: rich`${code(element)} → ${code(parentElement)}, climb`,
      historyEntry: `parent[${element}] = ${parentElement} → up`,
      focusedElements: [element],
      activeVariables: ["element"],
      explanation: rich`${code(`parent[${element}] = ${parentElement}`)}, which is not ${code(element)} itself, so ${code(element)} is not a root (${linesOf("checkRoot")}). find calls itself on ${code(parentElement)} to keep climbing toward the root (${linesOf("compress")}).`,
    });

    const root = find(parentElement);
    parent[element] = root;
    variables.element = element;

    if (root === parentElement) {
      record({
        region: "compress",
        caption: rich`${code(element)} already points to the root`,
        historyEntry: `parent[${element}] = ${root}`,
        focusedElements: [element],
        activeVariables: ["element"],
        explanation: rich`Back in the call for ${code(element)}, the root ${code(root)} comes back and is stored in ${code(`parent[${element}]`)} (${linesOf("compress")}). It already pointed there, so nothing changes.`,
      });
    } else {
      record({
        region: "compress",
        caption: rich`${code(element)} now points to ${code(root)}`,
        historyEntry: `parent[${element}] ← ${root}`,
        focusedElements: [element],
        activeVariables: ["element"],
        explanation: rich`Back in the call for ${code(element)}, the root ${code(root)} comes back and ${code(`parent[${element}]`)} changes from ${code(parentElement)} to ${code(root)} (${linesOf("compress")}). From now on ${code(element)} reaches the root in one hop: this is path compression.`,
      });
    }
    openFindCalls.pop();

    return root;
  }

  record({
    region: "signature",
    caption: rich`${code(elementCount)} elements, ${code(pairs.length)} pairs`,
    historyEntry: `n = ${elementCount}`,
    explanation: rich`Union-find keeps elements in disjoint sets with a single array, ${code("parent")}. Each element points to another element of its set, and the one that points to itself is the root that represents the set. A union joins the sets of two elements, and a find returns the root of an element.`,
  });
  record({
    region: "initialize",
    caption: rich`every element is its own root`,
    historyEntry: "parent[i] = i",
    explanation: rich`${code("parent")} starts as ${code(`[${parent.join(", ")}]`)} (${linesOf("initialize")}): every element points to itself, so each one is a set of its own.`,
  });

  for (const [pairIndex, [first, second]] of pairs.entries()) {
    unionStatuses[pairIndex] = "current";
    variables.first = first;
    variables.second = second;
    variables.element = null;
    variables.firstRoot = null;
    variables.secondRoot = null;

    record({
      region: "nextPair",
      caption: rich`join ${code(first)} and ${code(second)}`,
      historyEntry: `union(${first},${second})`,
      focusedElements: [first, second],
      activeVariables: ["first", "second"],
      explanation: rich`The loop takes the next pair and joins the sets that contain ${code(first)} and ${code(second)} (${linesOf("nextPair")}). First it needs the root of each one.`,
    });

    const firstRoot = find(first);
    variables.element = null;
    variables.firstRoot = firstRoot;

    record({
      region: "findFirstRoot",
      caption: rich`root of ${code(first)} is ${code(firstRoot)}`,
      historyEntry: `find(${first}) = ${firstRoot}`,
      focusedElements: [firstRoot],
      activeVariables: ["firstRoot"],
      explanation: rich`find returns ${code(firstRoot)}, the root of the set that contains ${code(first)} (${linesOf("findFirstRoot")}).`,
    });

    const secondRoot = find(second);
    variables.element = null;
    variables.secondRoot = secondRoot;

    record({
      region: "findSecondRoot",
      caption: rich`root of ${code(second)} is ${code(secondRoot)}`,
      historyEntry: `find(${second}) = ${secondRoot}`,
      focusedElements: [secondRoot],
      activeVariables: ["secondRoot"],
      explanation: rich`find returns ${code(secondRoot)}, the root of the set that contains ${code(second)} (${linesOf("findSecondRoot")}).`,
    });

    if (firstRoot === secondRoot) {
      record({
        region: "compareRoots",
        caption: rich`same root → nothing to join`,
        historyEntry: `${firstRoot} = ${secondRoot} → skip`,
        focusedElements: [firstRoot],
        activeVariables: ["firstRoot", "secondRoot"],
        explanation: rich`Both roots are ${code(firstRoot)}, so ${code(first)} and ${code(second)} are already in the same set (${linesOf("compareRoots")}), and the array stays as it is.`,
      });
      unionStatuses[pairIndex] = "skipped";
      continue;
    }

    record({
      region: "compareRoots",
      caption: rich`${code(`${firstRoot} ≠ ${secondRoot}`)} → join`,
      historyEntry: `${firstRoot} ≠ ${secondRoot} → link`,
      focusedElements: [firstRoot, secondRoot],
      activeVariables: ["firstRoot", "secondRoot"],
      explanation: rich`The roots are different (${linesOf("compareRoots")}), so ${code(first)} and ${code(second)} are in separate sets that still have to be joined.`,
    });

    parent[secondRoot] = firstRoot;

    record({
      region: "link",
      caption: rich`${code(secondRoot)} now points to ${code(firstRoot)}`,
      historyEntry: `parent[${secondRoot}] ← ${firstRoot}`,
      focusedElements: [secondRoot],
      activeVariables: ["firstRoot", "secondRoot"],
      explanation: rich`${code(`parent[${secondRoot}] = ${firstRoot}`)} (${linesOf("link")}): the root of the second set now points to the root of the first, and the two sets become one. A single cell of the array changes.`,
    });
    unionStatuses[pairIndex] = "linked";
  }

  variables.first = null;
  variables.second = null;
  variables.firstRoot = null;
  variables.secondRoot = null;

  const sets = listSets(parent);

  record({
    region: "returnResult",
    caption: rich`${code(sets.length)} sets`,
    historyEntry: "return parent",
    explanation: rich`No pairs are left, and the function returns ${code("parent")}. It describes ${code(sets.length)} sets: ${code(sets.map((set) => `{${set.join(", ")}}`).join(" "))}. Following ${code("parent")} from any element leads to the root of its set.`,
  });

  return steps;
}

function listSets(parent: readonly number[]): number[][] {
  const membersByRoot = new Map<number, number[]>();

  for (const element of parent.keys()) {
    let root = element;
    while (parent[root] !== root) root = parent[root];

    membersByRoot.set(root, [...(membersByRoot.get(root) ?? []), element]);
  }

  return [...membersByRoot.values()];
}
