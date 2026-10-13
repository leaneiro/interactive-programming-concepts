import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomArray } from "@/structures/array/randomArray";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import pythonCode from "./python.txt?raw";
import rustCode from "./rust.txt?raw";
import swiftCode from "./swift.txt?raw";
import { traceSelectionSort } from "./trace";
import typescriptCode from "./typescript.txt?raw";

export const selectionSort = defineAlgorithm({
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  complexity: "O(n²)",
  traits: ["unstable", "in-place"],
  createInput: createRandomArray,
  trace: traceSelectionSort,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        outerLoop: lines(3, 4),
        compare: line(6),
        updateMinimum: line(7),
        alreadyInPlace: line(10),
        swap: lines(11, 13),
        returnResult: line(16),
      },
      variableNames: {
        temporary: "tmp",
        length: "a.length",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        outerLoop: lines(4, 5),
        compare: line(7),
        updateMinimum: line(8),
        alreadyInPlace: line(9),
        swap: line(10),
        returnResult: line(11),
      },
      variableNames: {
        length: "n",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "java",
      code: javaCode,
      regions: {
        signature: line(1),
        outerLoop: lines(2, 3),
        compare: line(5),
        updateMinimum: line(6),
        alreadyInPlace: line(9),
        swap: lines(10, 12),
        returnResult: line(15),
      },
      variableNames: {
        temporary: "tmp",
        length: "a.length",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        outerLoop: lines(3, 4),
        compare: line(6),
        updateMinimum: line(7),
        alreadyInPlace: line(10),
        swap: line(11),
        returnResult: line(14),
      },
      variableNames: {
        length: "n",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        outerLoop: lines(3, 4),
        compare: line(6),
        updateMinimum: line(7),
        alreadyInPlace: line(10),
        swap: line(11),
        returnResult: line(14),
      },
      variableNames: {
        length: "n",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "rust",
      code: rustCode,
      regions: {
        signature: line(1),
        outerLoop: lines(3, 4),
        compare: line(6),
        updateMinimum: line(7),
        alreadyInPlace: line(10),
        swap: line(11),
        returnResult: line(14),
      },
      variableNames: {
        length: "n",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
    {
      languageId: "swift",
      code: swiftCode,
      regions: {
        signature: line(1),
        outerLoop: lines(4, 5),
        compare: line(7),
        updateMinimum: line(8),
        alreadyInPlace: line(11),
        swap: line(12),
        returnResult: line(15),
      },
      variableNames: {
        length: "n",
        targetIndex: "i",
        candidateIndex: "j",
        minimumIndex: "smallest",
      },
    },
  ],
});
