import { useEffect, useSyncExternalStore } from "react";
import type { LanguageId } from "@/algorithms/languages";
import {
  readHighlight,
  requestHighlight,
  subscribeToHighlights,
  type Highlight,
} from "@/lib/highlighter";

export function useHighlight(languageId: LanguageId): Highlight {
  useEffect(() => {
    requestHighlight(languageId);
  }, [languageId]);

  return useSyncExternalStore(subscribeToHighlights, () =>
    readHighlight(languageId),
  );
}
