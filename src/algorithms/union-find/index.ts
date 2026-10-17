import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { randomUniqueIntegers } from "@/lib/random";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import kotlinCode from "./kotlin.txt?raw";
import pythonCode from "./python.txt?raw";
import rustCode from "./rust.txt?raw";
import swiftCode from "./swift.txt?raw";
import { traceUnionFind, type ElementPair, type UnionFindInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

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
      languageId: "typescript",
      code: typescriptCode,
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
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        nextPair: lines(3, 4),
        checkRoot: line(9),
        compress: line(10),
        returnRoot: line(11),
        findFirstRoot: line(15),
        findSecondRoot: line(16),
        compareRoots: line(17),
        link: line(18),
        returnResult: line(5),
      },
      variableNames: {
        first: "a",
        second: "b",
        element: "x",
        firstRoot: "root_a",
        secondRoot: "root_b",
      },
    },
    {
      languageId: "java",
      code: javaCode,
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
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(4),
        initialize: lines(5, 8),
        nextPair: lines(9, 10),
        checkRoot: line(16),
        compress: line(17),
        returnRoot: line(19),
        findFirstRoot: line(23),
        findSecondRoot: line(24),
        compareRoots: line(25),
        link: line(26),
        returnResult: line(12),
      },
      variableNames: {
        first: "a",
        second: "b",
        element: "x",
        firstRoot: "rootA",
        secondRoot: "rootB",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 5),
        nextPair: lines(6, 7),
        checkRoot: line(13),
        compress: line(14),
        returnRoot: line(16),
        findFirstRoot: line(20),
        findSecondRoot: line(21),
        compareRoots: line(22),
        link: line(23),
        returnResult: line(9),
      },
      variableNames: {
        first: "a",
        second: "b",
        element: "x",
        firstRoot: "rootA",
        secondRoot: "rootB",
      },
    },
    {
      languageId: "rust",
      code: rustCode,
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
        firstRoot: "root_a",
        secondRoot: "root_b",
      },
    },
    {
      languageId: "swift",
      code: swiftCode,
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
