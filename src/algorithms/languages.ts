export const languages = {
  typescript: { name: "TypeScript", fileExtension: "ts" },
  python: { name: "Python", fileExtension: "py" },
  go: { name: "Go", fileExtension: "go" },
} as const;

export type LanguageId = keyof typeof languages;
