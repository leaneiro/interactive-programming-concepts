import type { LanguageId } from "@/algorithms/languages";

export interface CodeToken {
  content: string;
  color?: string | undefined;
}

export type CodeLine = readonly CodeToken[];

export type Highlight = (code: string, languageId: LanguageId) => CodeLine[];

export const highlightAsPlainText: Highlight = (code) =>
  code.split("\n").map((lineContent) => [{ content: lineContent }]);

export const highlightReady: Promise<Highlight> = import("./shikiHighlighter")
  .then(({ createShikiHighlight }) => createShikiHighlight())
  .catch(() => highlightAsPlainText);
