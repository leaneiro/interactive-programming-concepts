export interface ArrayState {
  kind: "array";
  values: readonly number[];
  highlightedIndices: readonly number[];
}
