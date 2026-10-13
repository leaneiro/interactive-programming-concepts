import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/cpp.txt?raw";
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

const compiler = "g++";
const languageStandard = "-std=c++20";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `vector<int>{${argument.values.join(", ")}}`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree({${argument.values.join(", ")}})`;
    case "graph": {
      const entries = listAdjacency(argument.graph).map(
        ([node, neighbors]) =>
          `{${JSON.stringify(node)}, vector<string>{${quoteAll(neighbors)}}}`,
      );

      return `Graph{${entries.join(", ")}}`;
    }
  }
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `listInOrder(${call})` : call;
}

export const cppAdapter: LanguageAdapter = {
  entryPointPattern: /(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion(compiler, ["--version"], /(\d+\.\d+(?:\.\d+)?)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `    printResult(${result});`;
    });
    const mainFunction = ["int main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.cpp"), program);
      await runCommand(
        compiler,
        [languageStandard, "-o", "program", "main.cpp"],
        directory,
      );

      return runCommand(join(directory, "program"), []);
    });
  },
};
