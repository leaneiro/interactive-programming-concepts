import type { Algorithm } from "./algorithm";
import { bstDelete } from "./bst-delete";
import { bstInsert } from "./bst-insert";
import { bstSearch } from "./bst-search";
import { bubbleSort } from "./bubble-sort";
import { breadthFirstSearch } from "./graph-bfs";
import { selectionSort } from "./selection-sort";
import { unionFind } from "./union-find";

export const algorithms: readonly [Algorithm, ...Algorithm[]] = [
  bubbleSort,
  selectionSort,
  bstSearch,
  bstInsert,
  bstDelete,
  unionFind,
  breadthFirstSearch,
];
