import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/swift.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument, ResultKind } from "../verification";
import {
  cannotHandle,
  listAdjacency,
  quoteAll,
  writeCalls,
  type LanguageAdapter,
} from "./adapter";

const compiler = "swiftc";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `[${argument.values.join(", ")}]`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree([${argument.values.join(", ")}])`;
    case "graph": {
      const entries = listAdjacency(argument.graph).map(
        ([node, neighbors]) =>
          `${JSON.stringify(node)}: [${quoteAll(neighbors)}]`,
      );

      return `[${entries.join(", ")}]`;
    }
    case "pairs":
      return cannotHandle("Swift", argument.kind);
  }
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `listInOrder(${call})` : call;
}

export const swiftAdapter: LanguageAdapter = {
  entryPointPattern: /func\s+(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion(
      compiler,
      ["--version"],
      /Swift version (\d+(?:\.\d+)+)/,
    ),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `print(${result})`;
    });

    return [prelude, snippetCode, ...outputStatements].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.swift"), program);
      await runCommand(compiler, ["-o", "program", "main.swift"], directory);

      return runCommand(join(directory, "program"), []);
    });
  },
};
