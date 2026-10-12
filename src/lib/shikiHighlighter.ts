import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { LanguageId } from "@/algorithms/languages";
import type { Highlight } from "./highlighter";

const grammars = {
  typescript: () => import("shiki/langs/typescript.mjs"),
  python: () => import("shiki/langs/python.mjs"),
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
      scope: ["support.type", "entity.name.type"],
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

export async function createShikiHighlight(): Promise<Highlight> {
  const highlighter = await createHighlighterCore({
    themes: [theme],
    langs: Object.values(grammars).map((loadGrammar) => loadGrammar()),
    engine: createJavaScriptRegexEngine(),
  });

  return (code, languageId) => {
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
