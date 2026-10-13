import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/go.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument, ResultKind } from "../verification";
import {
  listAdjacency,
  quoteAll,
  writeCalls,
  type LanguageAdapter,
} from "./adapter";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `[]int{${argument.values.join(", ")}}`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree(${argument.values.join(", ")})`;
    case "graph": {
      const entries = listAdjacency(argument.graph).map(
        ([node, neighbors]) =>
          `${JSON.stringify(node)}: {${quoteAll(neighbors)}}`,
      );

      return `map[string][]string{${entries.join(", ")}}`;
    }
  }
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `listInOrder(${call})` : call;
}

export const goAdapter: LanguageAdapter = {
  entryPointPattern: /func\s+(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion("go", ["version"], /go(\d+(?:\.\d+)+)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `\tprintResult(${result})`;
    });
    const mainFunction = ["func main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.go"), program);

      return runCommand("go", ["run", "main.go"], directory);
    });
  },
};
