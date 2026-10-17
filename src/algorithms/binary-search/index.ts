import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { pickRandom, randomInteger, randomUniqueIntegers } from "@/lib/random";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import kotlinCode from "./kotlin.txt?raw";
import pythonCode from "./python.txt?raw";
import rustCode from "./rust.txt?raw";
import swiftCode from "./swift.txt?raw";
import { traceBinarySearch, type BinarySearchInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

const valueCount = 12;
const smallestValue = 1;
const largestValue = 99;
const chanceOfExistingTarget = 0.8;
const fewestChecks = 3;

function randomMissingValue(values: readonly number[]): number {
  const candidate = randomInteger(smallestValue, largestValue);

  return values.includes(candidate) ? randomMissingValue(values) : candidate;
}

function createRandomInput(): BinarySearchInput {
  const values = randomUniqueIntegers(
    valueCount,
    smallestValue,
    largestValue,
  ).toSorted((first, second) => first - second);
  const target =
    Math.random() < chanceOfExistingTarget
      ? pickRandom(values)
      : randomMissingValue(values);

  return { values, target };
}

function takesEnoughChecks(input: BinarySearchInput): boolean {
  const checks = traceBinarySearch(input).filter(
    (step) => step.region === "middle",
  );

  return checks.length >= fewestChecks;
}

function createInput(): BinarySearchInput {
  let input = createRandomInput();
  while (!takesEnoughChecks(input)) input = createRandomInput();

  return input;
}

export const binarySearch = defineAlgorithm({
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  complexity: "O(log n)",
  traits: ["sorted array", "divide and conquer"],
  createInput,
  trace: traceBinarySearch,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: lines(6, 7),
        goRight: lines(8, 9),
        goLeft: lines(10, 11),
        notFound: line(14),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        middle: lines(3, 4),
        found: lines(5, 6),
        goRight: lines(7, 8),
        goLeft: lines(9, 10),
        notFound: line(11),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "java",
      code: javaCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: lines(6, 7),
        goRight: lines(8, 9),
        goLeft: lines(10, 11),
        notFound: line(14),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: lines(6, 7),
        goRight: lines(8, 9),
        goLeft: lines(10, 11),
        notFound: line(14),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        initialize: line(2),
        middle: lines(3, 4),
        found: lines(6, 7),
        goRight: lines(8, 9),
        goLeft: lines(10, 11),
        notFound: line(14),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "rust",
      code: rustCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: line(7),
        goRight: line(8),
        goLeft: line(9),
        notFound: line(12),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "swift",
      code: swiftCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: lines(6, 7),
        goRight: lines(8, 9),
        goLeft: lines(10, 11),
        notFound: line(14),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
    {
      languageId: "kotlin",
      code: kotlinCode,
      regions: {
        signature: line(1),
        initialize: lines(2, 3),
        middle: lines(4, 5),
        found: line(7),
        goRight: line(8),
        goLeft: line(9),
        notFound: line(12),
      },
      variableNames: {
        target: "target",
        low: "low",
        high: "high",
        middle: "mid",
      },
    },
  ],
});
