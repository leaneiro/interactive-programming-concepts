export type UnionStatus = "pending" | "current" | "linked" | "skipped";

export interface ForestUnion {
  first: number;
  second: number;
  status: UnionStatus;
}

export interface ForestState {
  kind: "forest";
  name: string;
  parent: readonly number[];
  focusedElements: readonly number[];
  pathElements: readonly number[];
  unions: readonly ForestUnion[];
}
