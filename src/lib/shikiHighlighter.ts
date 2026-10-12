import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { LanguageId } from "@/algorithms/languages";
import type { Highlight } from "./highlighter";

const grammars = {
  typescript: () => import("shiki/langs/typescript.mjs"),
  python: () => import("shiki/langs/python.mjs"),
} satisfies Record<LanguageId, () => Promise<unknown>>;

export async function createShikiHighlight(): Promise<Highlight> {
  const highlighter = await createHighlighterCore({
    themes: [
      import("shiki/themes/github-light.mjs"),
      import("shiki/themes/github-dark.mjs"),
    ],
    langs: Object.values(grammars).map((loadGrammar) => loadGrammar()),
    engine: createJavaScriptRegexEngine(),
  });

  return (code, languageId) => {
    const { tokens } = highlighter.codeToTokens(code, {
      lang: languageId,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: "light-dark()",
    });

    return tokens.map((lineTokens) =>
      lineTokens.map((token) => ({
        content: token.content,
        color: token.htmlStyle?.color,
      })),
    );
  };
}
