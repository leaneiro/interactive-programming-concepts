import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomArray } from "@/structures/array/randomArray";
import goCode from "./go.txt?raw";
import pythonCode from "./python.txt?raw";
import { traceBubbleSort } from "./trace";
import typescriptCode from "./typescript.txt?raw";

export const bubbleSort = defineAlgorithm({
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  complexity: "O(n²)",
  traits: ["stable", "in-place"],
  createInput: createRandomArray,
  trace: traceBubbleSort,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        outerLoop: line(2),
        innerLoop: line(3),
        compare: line(4),
        swap: lines(5, 7),
        returnResult: line(11),
      },
      variableNames: {
        temporary: "t",
        length: "a.length",
        outerIndex: "i",
        innerIndex: "j",
      },
    },
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        outerLoop: line(4),
        innerLoop: line(5),
        compare: line(6),
        swap: lines(7, 9),
        returnResult: line(10),
      },
      variableNames: {
        temporary: "tmp",
        length: "n",
        outerIndex: "i",
        innerIndex: "j",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        outerLoop: line(3),
        innerLoop: line(4),
        compare: line(5),
        swap: line(6),
        returnResult: line(10),
      },
      variableNames: {
        length: "n",
        outerIndex: "i",
        innerIndex: "j",
      },
    },
  ],
});
