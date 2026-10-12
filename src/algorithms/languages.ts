export const languageNames = {
  typescript: "TypeScript",
  python: "Python",
} as const;

export type LanguageId = keyof typeof languageNames;
