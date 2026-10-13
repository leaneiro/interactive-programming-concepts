import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomArray } from "@/structures/array/randomArray";
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
  ],
});
