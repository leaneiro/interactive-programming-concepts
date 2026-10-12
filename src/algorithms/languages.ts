export const languages = {
  typescript: { name: "TypeScript", fileExtension: "ts" },
  python: { name: "Python", fileExtension: "py" },
} as const;

export type LanguageId = keyof typeof languages;
