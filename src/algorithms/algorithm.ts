import type { VisualState } from "@/structures/visualState";
import type { CategoryId } from "./categories";
import type { LanguageId } from "./languages";
import type { RichText } from "./richText";

export interface LineRange {
  firstLine: number;
  lastLine: number;
}

export function line(lineNumber: number): LineRange {
  return { firstLine: lineNumber, lastLine: lineNumber };
}

export function lines(firstLine: number, lastLine: number): LineRange {
  return { firstLine, lastLine };
}

export function describeLines({ firstLine, lastLine }: LineRange): string {
  return firstLine === lastLine
    ? `line ${firstLine}`
    : `lines ${firstLine}–${lastLine}`;
}

export interface Snippet<
  Region extends string = string,
  VariableId extends string = string,
> {
  languageId: LanguageId;
  code: string;
  regions: Record<Region, LineRange>;
  variableNames: Partial<Record<VariableId, string>>;
}

export type VariableValue = number | string | null;

export interface Counter {
  label: string;
  value: number;
}

export interface Step<
  Region extends string = string,
  State extends VisualState = VisualState,
  VariableId extends string = string,
> {
  region: Region;
  state: State;
  caption: RichText<Region>;
  explanation: RichText<Region>;
  historyEntry: string;
  variables: Record<VariableId, VariableValue>;
  activeVariables: readonly VariableId[];
  counters: readonly Counter[];
}

export interface StepDescription<
  Region extends string,
  VariableId extends string,
> {
  region: Region;
  caption: RichText<Region>;
  explanation: RichText<Region>;
  historyEntry: string;
  activeVariables?: readonly VariableId[];
}

interface AlgorithmMetadata {
  id: string;
  name: string;
  category: CategoryId;
  complexity: string;
  traits: readonly string[];
}

export interface Algorithm extends AlgorithmMetadata {
  snippets: readonly [Snippet, ...Snippet[]];
  createTrace: () => Step[];
}

interface AlgorithmDefinition<
  Input,
  Region extends string,
  VariableId extends string,
> extends AlgorithmMetadata {
  snippets: readonly [
    Snippet<NoInfer<Region>, NoInfer<VariableId>>,
    ...Snippet<NoInfer<Region>, NoInfer<VariableId>>[],
  ];
  createInput: () => Input;
  trace: (input: Input) => Step<Region, VisualState, VariableId>[];
}

export function defineAlgorithm<
  Input,
  Region extends string,
  VariableId extends string,
>({
  snippets,
  createInput,
  trace,
  ...metadata
}: AlgorithmDefinition<Input, Region, VariableId>): Algorithm {
  const [firstSnippet, ...otherSnippets] = snippets;

  return {
    ...metadata,
    snippets: [
      withoutTrailingWhitespace(firstSnippet),
      ...otherSnippets.map(withoutTrailingWhitespace),
    ],
    createTrace: () => trace(createInput()),
  };
}

function withoutTrailingWhitespace(snippet: Snippet): Snippet {
  return { ...snippet, code: snippet.code.trimEnd() };
}
