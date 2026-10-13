import { neighborsOf, type Graph } from "@/structures/graph/graph";
import type { AlgorithmVerification, Argument } from "../verification";

export interface LanguageAdapter {
  entryPointPattern: RegExp;
  findToolchainVersion: () => Promise<string | null>;
  writeProgram: (
    snippetCode: string,
    entryPoint: string,
    verification: AlgorithmVerification,
  ) => string;
  run: (program: string) => Promise<string>;
}

export function writeCalls(
  entryPoint: string,
  verification: AlgorithmVerification,
  renderArgument: (argument: Argument, position: number) => string,
): string[] {
  return verification.cases.map((verificationCase) => {
    const renderedArguments = verificationCase.arguments.map(renderArgument);

    return `${entryPoint}(${renderedArguments.join(", ")})`;
  });
}

export function listAdjacency(graph: Graph): [string, string[]][] {
  return graph.nodes.map((node) => [node, neighborsOf(graph, node)]);
}

export function quoteAll(texts: readonly string[]): string {
  return texts.map((text) => JSON.stringify(text)).join(", ");
}
