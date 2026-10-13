import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { pickRandom, randomInteger } from "@/lib/random";
import { createRandomSearchTree } from "@/structures/tree/randomTree";
import cppCode from "./cpp.txt?raw";
import javaCode from "./java.txt?raw";
import pythonCode from "./python.txt?raw";
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
    {
      languageId: "python",
      code: pythonCode,
      regions: {
        signature: line(1),
        notFound: lines(2, 3),
        compareLeft: line(5),
        recurseLeft: line(6),
        compareRight: line(7),
        recurseRight: line(8),
        found: line(9),
        removeLeaf: lines(11, 12),
        replaceWithRightChild: lines(14, 15),
        replaceWithLeftChild: lines(16, 17),
        findSuccessor: lines(19, 21),
        copySuccessor: line(23),
        removeSuccessor: line(24),
        returnNode: line(25),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
        successor: "successor",
      },
    },
    {
      languageId: "java",
      code: javaCode,
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
    {
      languageId: "cpp",
      code: cppCode,
      regions: {
        signature: line(1),
        notFound: lines(2, 4),
        compareLeft: line(6),
        recurseLeft: line(7),
        compareRight: line(8),
        recurseRight: line(9),
        found: line(10),
        removeLeaf: lines(12, 15),
        replaceWithRightChild: lines(17, 21),
        replaceWithLeftChild: lines(22, 26),
        findSuccessor: lines(28, 31),
        copySuccessor: line(33),
        removeSuccessor: line(34),
        returnNode: line(36),
      },
      variableNames: {
        value: "value",
        currentNode: "root",
        successor: "successor",
      },
    },
  ],
});
