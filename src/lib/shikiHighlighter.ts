import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { LanguageId } from "@/algorithms/languages";
import type { Highlight } from "./highlighter";

const grammars = {
  typescript: () => import("shiki/langs/typescript.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  cpp: () => import("shiki/langs/cpp.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  swift: () => import("shiki/langs/swift.mjs"),
} satisfies Record<LanguageId, () => Promise<unknown>>;

const themeName = "algo-lab";

const theme = {
  name: themeName,
  type: "dark" as const,
  colors: {
    "editor.foreground": "var(--color-syntax-plain)",
    "editor.background": "transparent",
  },
  tokenColors: [
    {
      scope: ["keyword", "storage"],
      settings: { foreground: "var(--color-syntax-keyword)" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "var(--color-syntax-plain)" },
    },
    {
      scope: [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.logical.python",
      ],
      settings: { foreground: "var(--color-syntax-keyword)" },
    },
    {
      scope: [
        "support.type",
        "entity.name.type",
        "storage.type.primitive",
        "storage.type.built-in",
        "storage.type.java",
        "storage.type.numeric.go",
        "storage.type.string.go",
        "storage.type.boolean.go",
      ],
      settings: { foreground: "var(--color-syntax-type)" },
    },
    {
      scope: ["constant.numeric"],
      settings: { foreground: "var(--color-syntax-number)" },
    },
    {
      scope: ["entity.name.function"],
      settings: { foreground: "var(--color-syntax-function)" },
    },
    {
      scope: ["comment"],
      settings: { foreground: "var(--color-syntax-comment)" },
    },
  ],
};

const highlighterReady = createHighlighterCore({
  themes: [theme],
  langs: [],
  engine: createJavaScriptRegexEngine(),
});

export async function createShikiHighlight(
  languageId: LanguageId,
): Promise<Highlight> {
  const highlighter = await highlighterReady;
  await highlighter.loadLanguage(grammars[languageId]());

  return (code) => {
    const { tokens } = highlighter.codeToTokens(code, {
      lang: languageId,
      theme: themeName,
    });

    return tokens.map((lineTokens) =>
      lineTokens.map((token) => ({
        content: token.content,
        color: token.color,
      })),
    );
  };
}
