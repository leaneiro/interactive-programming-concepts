import { Suspense, use, useEffect, useMemo, useRef } from "react";
import {
  describeLines,
  type LineRange,
  type Snippet,
  type Step,
} from "@/algorithms/algorithm";
import { languages } from "@/algorithms/languages";
import {
  highlightAsPlainText,
  highlightReady,
  type CodeLine,
} from "@/lib/highlighter";
import { RichTextView } from "./RichTextView";

interface CodeColumnProps {
  algorithmId: string;
  snippet: Snippet;
  step: Step;
}

export function CodeColumn({ algorithmId, snippet, step }: CodeColumnProps) {
  const activeLines = snippet.regions[step.region];
  const fileName = `${algorithmId}.${languages[snippet.languageId].fileExtension}`;
  const plainCodeLines = highlightAsPlainText(snippet.code, snippet.languageId);

  return (
    <section aria-label="Source code" className="flex min-h-0 min-w-0 flex-col">
      <header className="flex items-center gap-2 border-b border-border px-5 py-3 font-mono text-meta text-tertiary">
        <span className="text-foreground/90">{fileName}</span>
        <span className="ml-auto">{describeLines(activeLines)}</span>
      </header>

      <Suspense
        fallback={
          <CodeListing codeLines={plainCodeLines} activeLines={activeLines} />
        }
      >
        <HighlightedCode snippet={snippet} activeLines={activeLines} />
      </Suspense>

      <footer className="mt-auto flex min-h-38 flex-col gap-2 border-t border-border px-5 py-4">
        <h2 className="section-label">What is happening</h2>
        <p
          role="status"
          className="text-body leading-[1.55] text-pretty text-foreground/85"
        >
          <RichTextView text={step.explanation} regions={snippet.regions} />
        </p>
      </footer>
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
  const listingRef = useRef<HTMLPreElement>(null);
  const firstActiveLineRef = useRef<HTMLDivElement>(null);
  const { firstLine, lastLine } = activeLines;

  useEffect(() => {
    const listing = listingRef.current;
    const firstActiveLine = firstActiveLineRef.current;
    if (listing === null || firstActiveLine === null) return;

    const activeTop = firstActiveLine.offsetTop;
    const activeHeight =
      firstActiveLine.offsetHeight * (lastLine - firstLine + 1);
    const isFullyVisible =
      activeTop >= listing.scrollTop &&
      activeTop + activeHeight <= listing.scrollTop + listing.clientHeight;

    if (!isFullyVisible) {
      listing.scrollTop = activeTop - (listing.clientHeight - activeHeight) / 2;
    }
  }, [firstLine, lastLine]);

  return (
    <pre
      ref={listingRef}
      className="relative min-h-0 overflow-auto py-4.5 font-mono text-body leading-[1.95] [tab-size:2] text-syntax-plain"
    >
      <code className="block min-w-max">
        {codeLines.map((codeLine, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const isActive = lineNumber >= firstLine && lineNumber <= lastLine;

          return (
            <div
              key={lineNumber}
              ref={lineNumber === firstLine ? firstActiveLineRef : null}
              data-active={isActive}
              className="flex gap-4.5 px-5 data-[active=true]:bg-accent-tint"
            >
              <span
                aria-hidden="true"
                className="w-5.5 shrink-0 text-right text-faded select-none"
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
