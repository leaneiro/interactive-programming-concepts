export interface ArrayState {
  kind: "array";
  name: string;
  values: readonly number[];
  comparedIndices: readonly number[];
  sortedIndices: readonly number[];
}
