export type SearchOutcome = "searching" | "found" | "missing";

export interface SearchRangeState {
  kind: "searchRange";
  name: string;
  values: readonly number[];
  target: number;
  low: number | null;
  high: number | null;
  middle: number | null;
  outcome: SearchOutcome;
}
