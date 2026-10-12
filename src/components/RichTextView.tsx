import { describeLines, type LineRange } from "@/algorithms/algorithm";
import type { RichText } from "@/algorithms/richText";

interface RichTextViewProps {
  text: RichText;
  regions: Record<string, LineRange>;
}

export function RichTextView({ text, regions }: RichTextViewProps) {
  return text.map((part, partIndex) => {
    if (typeof part === "string") return part;
    if (part.kind === "lines") return describeLines(regions[part.region]);

    return (
      <code key={partIndex} className="font-mono text-accent-text">
        {part.text}
      </code>
    );
  });
}
