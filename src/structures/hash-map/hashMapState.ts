export interface HashMapEntry {
  key: number;
  value: number;
}

export interface HashMapLookup {
  key: number;
  isFound: boolean;
}

export interface HashMapState {
  kind: "hashMap";
  arrayName: string;
  values: readonly number[];
  currentIndex: number | null;
  matchedIndices: readonly number[];
  mapName: string;
  entries: readonly HashMapEntry[];
  lookup: HashMapLookup | null;
  newestKey: number | null;
}
