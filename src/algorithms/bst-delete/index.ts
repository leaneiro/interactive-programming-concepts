import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { pickRandom, randomInteger } from "@/lib/random";
import { createRandomSearchTree } from "@/structures/tree/randomTree";
import { traceBstDelete, type BstDeleteInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

function createInput(): BstDeleteInput {
  const { root, values } = createRandomSearchTree(randomInteger(5, 8));

  return { root, value: pickRandom(values) };
}

export const bstDelete = defineAlgorithm({
  id: "bst-delete",
  name: "BST Delete",
  category: "structures",
  complexity: "O(h)",
  traits: ["binary search tree"],
  createInput,
  trace: traceBstDelete,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        notFound: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        found: line(10),
        removeLeaf: lines(12, 14),
        replaceWithRightChild: lines(16, 18),
        replaceWithLeftChild: lines(19, 21),
        findSuccessor: lines(23, 26),
        copySuccessor: line(28),
        removeSuccessor: line(29),
        returnNode: line(31),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
        successor: "successor",
      },
    },
  ],
});
