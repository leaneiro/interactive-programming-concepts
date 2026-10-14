export const languageIds = [
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "swift",
  "kotlin",
] as const;

export type LanguageId = (typeof languageIds)[number];

interface Language {
  name: string;
  fileExtension: string;
}

export const languages: Record<LanguageId, Language> = {
  typescript: { name: "TypeScript", fileExtension: "ts" },
  python: { name: "Python", fileExtension: "py" },
  java: { name: "Java", fileExtension: "java" },
  cpp: { name: "C++", fileExtension: "cpp" },
  go: { name: "Go", fileExtension: "go" },
  rust: { name: "Rust", fileExtension: "rs" },
  swift: { name: "Swift", fileExtension: "swift" },
  kotlin: { name: "Kotlin", fileExtension: "kt" },
};
