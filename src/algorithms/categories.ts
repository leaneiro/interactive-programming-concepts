export const categoryNames = {
  sorting: "Sorting",
  searching: "Searching",
  structures: "Structures",
  graphs: "Graphs",
} as const;

export type CategoryId = keyof typeof categoryNames;
