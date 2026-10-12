export const languageIds = ["typescript", "python", "java", "go"] as const;

export type LanguageId = (typeof languageIds)[number];

interface Language {
  name: string;
  fileExtension: string;
}

export const languages: Record<LanguageId, Language> = {
  typescript: { name: "TypeScript", fileExtension: "ts" },
  python: { name: "Python", fileExtension: "py" },
  java: { name: "Java", fileExtension: "java" },
  go: { name: "Go", fileExtension: "go" },
};
