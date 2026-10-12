export const languageIds = ["typescript", "python", "go"] as const;

export type LanguageId = (typeof languageIds)[number];

interface Language {
  name: string;
  fileExtension: string;
}

export const languages: Record<LanguageId, Language> = {
  typescript: { name: "TypeScript", fileExtension: "ts" },
  python: { name: "Python", fileExtension: "py" },
  go: { name: "Go", fileExtension: "go" },
};
