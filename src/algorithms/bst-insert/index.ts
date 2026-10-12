import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { randomInteger } from "@/lib/random";
import {
  createRandomSearchTree,
  randomValueOutside,
} from "@/structures/tree/randomTree";
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
  ],
});
