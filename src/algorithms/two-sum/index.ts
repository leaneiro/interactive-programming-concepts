import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { randomUniqueIntegers } from "@/lib/random";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import kotlinCode from "./kotlin.txt?raw";
import pythonCode from "./python.txt?raw";
import rustCode from "./rust.txt?raw";
import swiftCode from "./swift.txt?raw";
import { traceTwoSum, type TwoSumInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

const valueCount = 8;
const smallestValue = 1;
const largestValue = 30;
const earliestMatchIndex = 4;

function createRandomInput(): TwoSumInput {
  const values = randomUniqueIntegers(valueCount, smallestValue, largestValue);
  const [firstIndex, secondIndex] = randomUniqueIntegers(2, 0, valueCount - 1);

  return { values, target: values[firstIndex] + values[secondIndex] };
}

function matchesLateEnough(input: TwoSumInput): boolean {
  const lastStep = traceTwoSum(input).at(-1);
  const matchIndex = lastStep?.state.matchedIndices.at(-1) ?? 0;

  return matchIndex >= earliestMatchIndex;
}

function createInput(): TwoSumInput {
  let input = createRandomInput();
  while (!matchesLateEnough(input)) input = createRandomInput();

  return input;
}

export const twoSum = defineAlgorithm({
  id: "two-sum",
  name: "Two Sum",
  category: "searching",
  complexity: "O(n)",
  traits: ["hash map", "one pass"],
  createInput,
  trace: traceTwoSum,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(7),
        notFound: line(8),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "java",
      code: javaCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        complement: lines(4, 5),
        lookup: line(6),
        found: line(7),
        store: line(9),
        notFound: line(11),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "rust",
      code: rustCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "swift",
      code: swiftCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
    {
      languageId: "kotlin",
      code: kotlinCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        complement: lines(3, 4),
        lookup: line(5),
        found: line(6),
        store: line(8),
        notFound: line(10),
      },
      variableNames: {
        target: "target",
        index: "i",
        complement: "complement",
      },
    },
  ],
});
