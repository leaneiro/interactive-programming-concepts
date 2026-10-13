import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { randomInteger } from "@/lib/random";
import {
  createRandomSearchTree,
  randomValueOutside,
} from "@/structures/tree/randomTree";
import cppCode from "./cpp.txt?raw";
import goCode from "./go.txt?raw";
import javaCode from "./java.txt?raw";
import pythonCode from "./python.txt?raw";
import { traceBstInsert, type BstInsertInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

function createInput(): BstInsertInput {
  const { root, values } = createRandomSearchTree(randomInteger(4, 7));

  return { root, value: randomValueOutside(values) };
}

export const bstInsert = defineAlgorithm({
  id: "bst-insert",
  name: "BST Insert",
  category: "structures",
  complexity: "O(h)",
  traits: ["binary search tree"],
  createInput,
  trace: traceBstInsert,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        createNode: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        returnNode: line(12),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
      },
    },
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        createNode: lines(2, 3),
        compareLeft: line(5),
        recurseLeft: line(6),
        compareRight: line(7),
        recurseRight: line(8),
        returnNode: line(10),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
      },
    },
    {
      languageId: "java",
      code: javaCode,
      regions: {
        signature: line(1),
        createNode: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        returnNode: line(12),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
      },
    },
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        createNode: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        returnNode: line(12),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
      },
    },
    {
      languageId: "go",
      code: goCode,
      regions: {
        signature: line(1),
        createNode: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        returnNode: line(12),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
      },
    },
  ],
});
