import type { Graph } from "@/structures/graph/graph";

export type Argument =
  | { kind: "integers"; values: readonly number[] }
  | { kind: "integer"; value: number }
  | { kind: "text"; value: string }
  | { kind: "tree"; values: readonly number[] }
  | { kind: "graph"; graph: Graph };

export type ResultKind = "integers" | "boolean" | "texts" | "treeInOrder";

export interface VerificationCase {
  arguments: readonly Argument[];
  expected: unknown;
}

export interface AlgorithmVerification {
  resultKind: ResultKind;
  cases: readonly VerificationCase[];
}

export function describeArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return JSON.stringify(argument.values);
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `tree${JSON.stringify(argument.values)}`;
    case "graph":
      return `graph(${argument.graph.edges.map((edge) => edge.join("-")).join(" ")})`;
  }
}

export function integers(values: readonly number[]): Argument {
  return { kind: "integers", values };
}

export function integer(value: number): Argument {
  return { kind: "integer", value };
}

export function text(value: string): Argument {
  return { kind: "text", value };
}

export function tree(values: readonly number[]): Argument {
  return { kind: "tree", values };
}

export function graphOf(graph: Graph): Argument {
  return { kind: "graph", graph };
}
