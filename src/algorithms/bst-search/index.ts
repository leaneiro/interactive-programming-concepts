import { defineAlgorithm, line, lines } from "@/algorithms/algorithm";
import { pickRandom } from "@/lib/random";
import {
  createRandomSearchTree,
  randomValueOutside,
} from "@/structures/tree/randomTree";
import { traceBstSearch, type BstSearchInput } from "./trace";
import typescriptCode from "./typescript.txt?raw";

const nodeCount = 7;
const chanceOfExistingTarget = 0.8;

function createInput(): BstSearchInput {
  const { root, values } = createRandomSearchTree(nodeCount);
  const target =
    Math.random() < chanceOfExistingTarget
      ? pickRandom(values)
      : randomValueOutside(values);

  return { root, target };
}

export const bstSearch = defineAlgorithm({
  id: "bst-search",
  name: "BST Search",
  category: "structures",
  complexity: "O(h)",
  traits: ["binary search tree"],
  createInput,
  trace: traceBstSearch,
  snippets: [
    {
      languageId: "typescript",
      code: typescriptCode,
      regions: {
        signature: line(1),
        loop: line(3),
        found: lines(4, 5),
        goLeft: lines(7, 8),
        goRight: lines(9, 10),
        notFound: line(13),
      },
      variableNames: {
        target: "key",
        currentNode: "curr",
      },
    },
  ],
});
