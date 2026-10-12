import type { VisualState } from "@/structures/visualState";
import type { LanguageId } from "./languages";

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

export interface Snippet<Region extends string = string> {
  languageId: LanguageId;
  code: string;
  regions: Record<Region, LineRange>;
}

export interface Step<
  Region extends string = string,
  State extends VisualState = VisualState,
> {
  region: Region;
  note: string;
  state: State;
}

export interface Algorithm {
  id: string;
  name: string;
  snippets: readonly [Snippet, ...Snippet[]];
  createTrace: () => Step[];
}

interface AlgorithmDefinition<Input, Region extends string> {
  id: string;
  name: string;
  snippets: readonly [Snippet<NoInfer<Region>>, ...Snippet<NoInfer<Region>>[]];
  createInput: () => Input;
  trace: (input: Input) => Step<Region>[];
}

export function defineAlgorithm<Input, Region extends string>({
  id,
  name,
  snippets,
  createInput,
  trace,
}: AlgorithmDefinition<Input, Region>): Algorithm {
  const [firstSnippet, ...otherSnippets] = snippets;

  return {
    id,
    name,
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
