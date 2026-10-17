import type { ArrayState } from "./array/arrayState";
import type { ForestState } from "./forest/forestState";
import type { GraphState } from "./graph/graphState";
import type { HashMapState } from "./hash-map/hashMapState";
import type { SearchRangeState } from "./search-range/searchRangeState";
import type { TreeState } from "./tree/treeState";

export type VisualState =
  | ArrayState
  | TreeState
  | GraphState
  | ForestState
  | HashMapState
  | SearchRangeState;
