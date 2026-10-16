import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { randomUniqueIntegers } from "@/lib/random";
import kotlinCode from "./kotlin.txt?raw";
import { traceUnionFind, type ElementPair, type UnionFindInput } from "./trace";

const elementCount = 8;
const pairCount = 6;

function createRandomInput(): UnionFindInput {
  const pairs = Array.from({ length: pairCount }, (): ElementPair => {
    const [first, second] = randomUniqueIntegers(2, 0, elementCount - 1);

    return [first, second];
  });

  return { elementCount, pairs };
}

function showsEveryCase(input: UnionFindInput): boolean {
  const steps = traceUnionFind(input);
  const joinsElementsAlreadyTogether = steps.some(
    (step) =>
      step.region === "compareRoots" &&
      step.variables.firstRoot === step.variables.secondRoot,
  );
  const compressesAPath = steps.some(
    (step, stepIndex) =>
      step.region === "compress" &&
      step.state.parent.some(
        (parentElement, element) =>
          parentElement !== steps[stepIndex - 1].state.parent[element],
      ),
  );

  return joinsElementsAlreadyTogether && compressesAPath;
}

function createInput(): UnionFindInput {
  let input = createRandomInput();
  while (!showsEveryCase(input)) input = createRandomInput();

  return input;
}

export const unionFind = defineAlgorithm({
  id: "union-find",
  name: "Union-Find",
  category: "structures",
  complexity: "O(log n)",
  traits: ["disjoint sets", "path compression"],
  createInput,
  trace: traceUnionFind,
  snippets: [
    {
      languageId: "kotlin",
      code: kotlinCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        nextPair: lines(3, 4),
        checkRoot: line(10),
        compress: line(11),
        returnRoot: line(13),
        findFirstRoot: line(17),
        findSecondRoot: line(18),
        compareRoots: line(19),
        link: line(20),
        returnResult: line(6),
      },
      variableNames: {
        first: "a",
        second: "b",
        element: "x",
        firstRoot: "rootA",
        secondRoot: "rootB",
      },
    },
  ],
});
