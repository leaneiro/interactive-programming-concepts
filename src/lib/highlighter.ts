import type { LanguageId } from "@/algorithms/languages";

export interface CodeToken {
  content: string;
  color?: string | undefined;
}

export type CodeLine = readonly CodeToken[];

export type Highlight = (code: string) => CodeLine[];

const highlightAsPlainText: Highlight = (code) =>
  code.split("\n").map((lineContent) => [{ content: lineContent }]);

const loadedHighlights = new Map<LanguageId, Highlight>();
const requestedLanguageIds = new Set<LanguageId>();
const highlightListeners = new Set<() => void>();

export function readHighlight(languageId: LanguageId): Highlight {
  return loadedHighlights.get(languageId) ?? highlightAsPlainText;
}

export function subscribeToHighlights(onChange: () => void): () => void {
  highlightListeners.add(onChange);

  return () => {
    highlightListeners.delete(onChange);
  };
}

export function requestHighlight(languageId: LanguageId): void {
  if (requestedLanguageIds.has(languageId)) return;
  requestedLanguageIds.add(languageId);

  void import("./shikiHighlighter")
    .then(({ createShikiHighlight }) => createShikiHighlight(languageId))
    .catch(() => highlightAsPlainText)
    .then((highlight) => {
      loadedHighlights.set(languageId, highlight);
      for (const notifyListener of highlightListeners) notifyListener();
    });
}
