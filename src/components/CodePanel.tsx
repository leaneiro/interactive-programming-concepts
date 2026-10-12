import { Suspense, use, useMemo } from "react";
import type { LineRange, Snippet } from "@/algorithms/algorithm";
import { languageNames } from "@/algorithms/languages";
import {
  highlightAsPlainText,
  highlightReady,
  type CodeLine,
} from "@/lib/highlighter";

interface CodePanelProps {
  title: string;
  snippet: Snippet;
  activeLines: LineRange;
}

export function CodePanel({ title, snippet, activeLines }: CodePanelProps) {
  const plainCodeLines = highlightAsPlainText(snippet.code, snippet.languageId);

  return (
    <section
      aria-label="Source code"
      className="flex min-w-0 flex-col overflow-hidden panel"
    >
      <header className="flex justify-between border-b border-border px-3 py-1.5 text-xs text-muted">
        <span>{title}</span>
        <span>{languageNames[snippet.languageId]}</span>
      </header>
      <Suspense
        fallback={
          <CodeListing codeLines={plainCodeLines} activeLines={activeLines} />
        }
      >
        <HighlightedCode snippet={snippet} activeLines={activeLines} />
      </Suspense>
    </section>
  );
}

interface HighlightedCodeProps {
  snippet: Snippet;
  activeLines: LineRange;
}

function HighlightedCode({ snippet, activeLines }: HighlightedCodeProps) {
  const highlight = use(highlightReady);
  const codeLines = useMemo(
    () => highlight(snippet.code, snippet.languageId),
    [highlight, snippet],
  );

  return <CodeListing codeLines={codeLines} activeLines={activeLines} />;
}

interface CodeListingProps {
  codeLines: readonly CodeLine[];
  activeLines: LineRange;
}

function CodeListing({ codeLines, activeLines }: CodeListingProps) {
  return (
    <pre className="overflow-auto py-3 font-mono text-sm leading-6">
      <code className="block min-w-max">
        {codeLines.map((codeLine, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const isActive =
            lineNumber >= activeLines.firstLine &&
            lineNumber <= activeLines.lastLine;

          return (
            <div
              key={lineNumber}
              data-active={isActive}
              className="flex gap-3 pr-4 data-[active=true]:bg-accent/20"
            >
              <span
                aria-hidden="true"
                className="w-10 shrink-0 text-right text-muted select-none"
              >
                {lineNumber}
              </span>
              <span className="whitespace-pre">
                {codeLine.map((token, tokenIndex) => (
                  <span key={tokenIndex} style={{ color: token.color }}>
                    {token.content}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}
