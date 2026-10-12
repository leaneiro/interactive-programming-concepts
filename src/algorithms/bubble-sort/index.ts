import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { createRandomArray } from "@/structures/array/randomArray";
import pythonCode from "./python.txt?raw";
import { traceBubbleSort } from "./trace";
import typescriptCode from "./typescript.txt?raw";

export const bubbleSort = defineAlgorithm({
  id: "bubble-sort",
  name: "Bubble Sort",
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
    },
  ],
});
